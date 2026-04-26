
import { executeQuery } from './bfobs';

export interface AffiliateLink {
    thumbnail: string;
    link: string;
    title: string;
}

export interface BrandAd {
    video_url: string;
    title: string;
    cta_text: string;
    cta_link: string;
}

export interface SectionLayout {
    heading: string;
    left: {
        type: "affiliate" | "adsense" | "nothing";
        affiliate?: AffiliateLink;
    };
    right: {
        type: "brand_ad" | "affiliate" | "adsense" | "nothing";
        brand_ad?: BrandAd;
        affiliate?: AffiliateLink;
    };
}

export interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author_name: string;
    author_avatar: string;
    thumbnail_url: string;
    read_time: number;
    tags: string[];
    sources: string[];
    affiliate_links: AffiliateLink[];
    brand_ads: BrandAd[];
    section_layouts: SectionLayout[];
    published_at: string;
    updated_at: string;
    view_count: number;
}

/**
 * Initialize the blogs table in BFOBS
 */
export async function initDatabase() {
    const query = `
        CREATE TABLE IF NOT EXISTS blogs (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            excerpt TEXT,
            content TEXT,
            category TEXT,
            author_name TEXT,
            author_avatar TEXT,
            thumbnail_url TEXT,
            read_time INTEGER DEFAULT 0,
            tags TEXT,
            sources TEXT,
            affiliate_links TEXT,
            brand_ads TEXT,
            section_layouts TEXT,
            published_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
            view_count INTEGER DEFAULT 0
        )
    `;
    await executeQuery(query);
    
    // Create products table
    const productQuery = `
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL, -- 'affiliate' | 'brand'
            title TEXT NOT NULL,
            thumbnail TEXT,
            link TEXT,
            video_url TEXT,
            cta_text TEXT,
            cta_link TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `;
    await executeQuery(productQuery);
    
    // Add new columns if they don't exist
    try { await executeQuery('ALTER TABLE blogs ADD COLUMN sources TEXT'); } catch(e) {}
    try { await executeQuery('ALTER TABLE blogs ADD COLUMN affiliate_links TEXT'); } catch(e) {}
    try { await executeQuery('ALTER TABLE blogs ADD COLUMN brand_ads TEXT'); } catch(e) {}
    try { await executeQuery('ALTER TABLE blogs ADD COLUMN section_layouts TEXT'); } catch(e) {}
    
    return true;
}

import { setCache, getCache, deleteCache } from './redis';

// Get all blogs
export async function getAllBlogs(): Promise<Blog[]> {
    const CACHE_KEY = 'all_blogs';
    
    try {
        // Try to get from cache first
        const cached = await getCache(CACHE_KEY);
        if (cached) return cached;

        const results = await executeQuery('SELECT * FROM blogs ORDER BY published_at DESC');
        const blogs = results.map((row: any) => parseBlogRow(row));

        // Store in cache for 1 hour
        await setCache(CACHE_KEY, blogs, 3600);
        
        return blogs;
    } catch (error) {
        console.error('Failed to fetch blogs from Turso:', error);
        return [];
    }
}

// Get blog by slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
        const results = await executeQuery('SELECT * FROM blogs WHERE slug = ? LIMIT 1', [slug]);
        if (results.length === 0) return null;
        
        const blog = results[0];
        return parseBlogRow(blog);
    } catch (error) {
        console.error(`Failed to fetch blog with slug ${slug}:`, error);
        return null;
    }
}

// Create new blog
export async function createBlog(blog: Partial<Blog>): Promise<Blog> {
    const id = Math.random().toString(36).substring(7);
    const now = new Date().toISOString();
    
    const newBlog = {
        id,
        title: blog.title || 'Untitled Post',
        slug: blog.slug || `post-${id}`,
        excerpt: blog.excerpt || '',
        content: blog.content || '',
        category: blog.category || 'General',
        author_name: blog.author_name || 'Admin',
        author_avatar: blog.author_avatar || '',
        thumbnail_url: blog.thumbnail_url || '',
        read_time: blog.read_time || 0,
        tags: JSON.stringify(blog.tags || []),
        sources: JSON.stringify(blog.sources || []),
        affiliate_links: JSON.stringify(blog.affiliate_links || []),
        brand_ads: JSON.stringify(blog.brand_ads || []),
        section_layouts: JSON.stringify(blog.section_layouts || []),
        published_at: now,
        updated_at: now,
        view_count: 0
    };

    const query = `
        INSERT INTO blogs (
            id, title, slug, excerpt, content, category, 
            author_name, author_avatar, thumbnail_url, 
            read_time, tags, sources, affiliate_links, brand_ads, section_layouts,
            published_at, updated_at, view_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await executeQuery(query, [
        newBlog.id, newBlog.title, newBlog.slug, newBlog.excerpt, newBlog.content, newBlog.category,
        newBlog.author_name, newBlog.author_avatar, newBlog.thumbnail_url,
        newBlog.read_time, newBlog.tags, newBlog.sources, newBlog.affiliate_links, newBlog.brand_ads, newBlog.section_layouts,
        newBlog.published_at, newBlog.updated_at, newBlog.view_count
    ]);

    // Invalidate cache
    await deleteCache('all_blogs');

    return parseBlogRow(newBlog);
}

// Update blog
export async function updateBlog(id: string, updates: Partial<Blog>): Promise<Blog> {
    const now = new Date().toISOString();
    
    // Convert tags to string if present
    const params: any[] = [];
    const setClauses: string[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
        if (key === 'id') return;
        setClauses.push(`${key} = ?`);
        if (key === 'tags' || key === 'sources' || key === 'affiliate_links' || key === 'brand_ads' || key === 'section_layouts') {
            params.push(JSON.stringify(value));
        } else {
            params.push(value);
        }
    });
    
    setClauses.push(`updated_at = ?`);
    params.push(now);
    params.push(id);

    const query = `UPDATE blogs SET ${setClauses.join(', ')} WHERE id = ?`;
    await executeQuery(query, params);
    
    // Invalidate cache
    await deleteCache('all_blogs');

    // Fetch updated blog
    const results = await executeQuery('SELECT * FROM blogs WHERE id = ?', [id]);
    return parseBlogRow(results[0]);
}

// Delete blog
export async function deleteBlog(id: string): Promise<void> {
    await executeQuery('DELETE FROM blogs WHERE id = ?', [id]);
    await deleteCache('all_blogs');
}

// Delete all blogs
export async function deleteAllBlogs(): Promise<void> {
    await executeQuery('DELETE FROM blogs');
    await deleteCache('all_blogs');
}

// Helper to parse blog row
function parseBlogRow(row: any): Blog {
    return {
        ...row,
        tags: JSON.parse(String(row.tags || '[]')),
        sources: JSON.parse(String(row.sources || '[]')),
        affiliate_links: JSON.parse(String(row.affiliate_links || '[]')),
        brand_ads: JSON.parse(String(row.brand_ads || '[]')),
        section_layouts: JSON.parse(String(row.section_layouts || '[]')),
    };
}

// Get blogs by category
export async function getBlogsByCategory(category: string): Promise<Blog[]> {
    if (category === 'All') return getAllBlogs();
    
    try {
        const results = await executeQuery('SELECT * FROM blogs WHERE category = ? ORDER BY published_at DESC', [category]);
        return results.map((row: any) => parseBlogRow(row));
    } catch (error) {
        console.error(`Failed to fetch blogs for category ${category}:`, error);
        return [];
    }
}

// Increment view count
export async function incrementViewCount(id: string): Promise<void> {
    await executeQuery('UPDATE blogs SET view_count = view_count + 1 WHERE id = ?', [id]);
}

// Get latest blogs
export async function getLatestBlogs(limit: number = 3): Promise<Blog[]> {
    try {
        const results = await executeQuery('SELECT * FROM blogs ORDER BY published_at DESC LIMIT ?', [limit]);
        return results.map((row: any) => parseBlogRow(row));
    } catch (error) {
        console.error('Failed to fetch latest blogs:', error);
        return [];
    }
}
