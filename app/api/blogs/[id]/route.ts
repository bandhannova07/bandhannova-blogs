
import { NextRequest, NextResponse } from "next/server";
import { updateBlog, deleteBlog } from "@/lib/blog-service";

// UPDATE blog
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updatedBlog = await updateBlog(id, body);

        // Notify Google Indexing API for immediate ranking
        try {
            const { notifyGoogleOfUpdate } = await import("@/lib/seo-service");
            await notifyGoogleOfUpdate(`https://blogs.bandhannova.in/blog/${updatedBlog.slug}`);
        } catch (seoError) {
            console.error("SEO Notification failed:", seoError);
        }

        return NextResponse.json({ blog: updatedBlog, success: true });
    } catch (error: any) {
        console.error("Error updating blog:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update blog" },
            { status: 500 }
        );
    }
}

// DELETE blog
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await deleteBlog(id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting blog:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete blog" },
            { status: 500 }
        );
    }
}
