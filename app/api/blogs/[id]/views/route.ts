
import { NextRequest, NextResponse } from "next/server";
import { incrementViewCount } from "@/lib/blog-service";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await incrementViewCount(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error incrementing view count:", error);
        return NextResponse.json(
            { error: error.message || "Failed to increment view count" },
            { status: 500 }
        );
    }
}
