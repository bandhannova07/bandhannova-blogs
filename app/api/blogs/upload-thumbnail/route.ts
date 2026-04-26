import { NextRequest, NextResponse } from "next/server";
import { uploadAsset } from "@/lib/cloudinary";

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

        // Convert file to base64 for Cloudinary upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        const result = await uploadAsset(fileBase64, 'bandhannova-blogs/thumbnails');
        
        return NextResponse.json({ 
            url: result.secure_url, 
            public_id: result.public_id,
            success: true 
        });
    } catch (error: any) {
        console.error("Error uploading to Cloudinary:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload asset" },
            { status: 500 }
        );
    }
}
