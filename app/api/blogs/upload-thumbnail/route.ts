import { NextRequest, NextResponse } from "next/server";
import { uploadThumbnail } from "@/lib/blog-service";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const url = await uploadThumbnail(file);
        return NextResponse.json({ url, success: true });
    } catch (error: any) {
        console.error("Error uploading thumbnail:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload thumbnail" },
            { status: 500 }
        );
    }
}
