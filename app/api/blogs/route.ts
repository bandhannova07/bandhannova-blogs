import { NextRequest, NextResponse } from "next/server";
import { createBlog, getAllBlogs } from "@/lib/blog-service";

// GET all blogs
export async function GET() {
    try {
        const blogs = await getAllBlogs();
        return NextResponse.json({ blogs });
    } catch (error: any) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch blogs" },
            { status: 500 }
        );
    }
}

// POST create new blog
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const blog = await createBlog({
            title: body.title,
            slug: body.slug,
            excerpt: body.excerpt,
            content: body.content,
            category: body.category,
            author_name: body.author_name,
            author_avatar: body.author_avatar,
            thumbnail_url: body.thumbnail_url,
            read_time: body.read_time,
            tags: body.tags,
            published_at: body.published_at,
        });

        return NextResponse.json({ blog, success: true });
    } catch (error: any) {
        console.error("Error creating blog:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create blog" },
            { status: 500 }
        );
    }
}
