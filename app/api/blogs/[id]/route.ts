import { NextRequest, NextResponse } from "next/server";
import { deleteBlog, updateBlog } from "@/lib/blog-service";

// DELETE blog by ID
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

// PUT update blog by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const blog = await updateBlog(id, body);
        return NextResponse.json({ blog, success: true });
    } catch (error: any) {
        console.error("Error updating blog:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update blog" },
            { status: 500 }
        );
    }
}
