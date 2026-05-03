import { NextResponse } from "next/server";
import { getAllBlogs } from "@/lib/blog-service";

export async function GET() {
    try {
        const blogs = await getAllBlogs();
        if (!blogs || blogs.length === 0) {
            return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "https://blogs.bandhannova.in"));
        }
        
        const randomBlog = blogs[Math.floor(Math.random() * blogs.length)];
        return NextResponse.redirect(new URL(`/blog/${randomBlog.slug}`, process.env.NEXT_PUBLIC_APP_URL || "https://blogs.bandhannova.in"));
    } catch (error) {
        return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "https://blogs.bandhannova.in"));
    }
}
