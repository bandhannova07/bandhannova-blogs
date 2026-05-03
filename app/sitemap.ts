import { MetadataRoute } from 'next';
import { getAllBlogs } from '@/lib/blog-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const blogs = await getAllBlogs();

    // Unique categories
    const categories = Array.from(new Set(blogs.map(b => b.category)));
    const categoryUrls = categories.map(cat => ({
        url: `https://blogs.bandhannova.in/category/${cat.toLowerCase()}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.6,
    }));

    const blogUrls = blogs.map((blog) => ({
        url: `https://blogs.bandhannova.in/blog/${blog.slug}`,
        lastModified: new Date(blog.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    const staticPages = [
        {
            url: 'https://blogs.bandhannova.in',
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: 'https://blogs.bandhannova.in/about',
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: 'https://blogs.bandhannova.in/contact',
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: 'https://blogs.bandhannova.in/privacy',
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.3,
        }
    ];

    return [
        ...staticPages,
        ...categoryUrls,
        ...blogUrls,
    ];
}
