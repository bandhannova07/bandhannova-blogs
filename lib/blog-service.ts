import { createAdminClient } from './supabase/server';
import type { Blog } from './supabase/types';

// Upload thumbnail to Supabase Storage
export async function uploadThumbnail(file: File): Promise<string> {
    const supabase = createAdminClient();

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage
        .from('blog-thumbnails')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        throw new Error(`Failed to upload thumbnail: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('blog-thumbnails')
        .getPublicUrl(filePath);

    return publicUrl;
}

// Create new blog
export async function createBlog(blog: any): Promise<Blog> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('blogs')
        .insert(blog)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create blog: ${error.message}`);
    }

    return data as Blog;
}

// Get all blogs
export async function getAllBlogs(): Promise<Blog[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('published_at', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch blogs: ${error.message}`);
    }

    return (data as Blog[]) || [];
}

// Get blog by slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            return null; // Not found
        }
        throw new Error(`Failed to fetch blog: ${error.message}`);
    }

    return data as Blog;
}

// Update blog
export async function updateBlog(id: string, updates: any): Promise<Blog> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('blogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to update blog: ${error.message}`);
    }

    return data as Blog;
}

// Delete blog
export async function deleteBlog(id: string): Promise<void> {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Failed to delete blog: ${error.message}`);
    }
}

// Get blogs by category
export async function getBlogsByCategory(category: string): Promise<Blog[]> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', category)
        .order('published_at', { ascending: false });

    if (error) {
        throw new Error(`Failed to fetch blogs: ${error.message}`);
    }

    return (data as Blog[]) || [];
}
