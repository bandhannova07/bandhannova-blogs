import { MetadataRoute } from 'next';
import { getAllBlogs } from '@/lib/blog-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const blogs = await getAllBlogs();

    const blogUrls = blogs.map((blog) => ({
        url: `https://blogs.bandhannova.in/blog/${blog.slug}`,
        lastModified: new Date(blog.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: 'https://blogs.bandhannova.in',
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        ...blogUrls,
    ];
}
