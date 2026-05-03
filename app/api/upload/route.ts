import { NextRequest, NextResponse } from "next/server";
import { uploadAsset } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string || "thumbnail";

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

        // Map types to folders
        let folder = 'bandhannova-blogs';
        switch (type) {
            case "thumbnail":
                folder = 'bandhannova-blogs/thumbnails';
                break;
            case "avatar":
                folder = 'bandhannova-blogs/avatars';
                break;
            case "brand_video":
                folder = 'bandhannova-blogs/brands';
                break;
            case "product_image":
                folder = 'bandhannova-blogs/products';
                break;
            case "blog_image":
                folder = 'bandhannova-blogs/content';
                break;
            default:
                folder = 'bandhannova-blogs/general';
        }

        const result = await uploadAsset(fileBase64, folder);

        return NextResponse.json({ url: result.secure_url, success: true });
    } catch (error: any) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload file" },
            { status: 500 }
        );
    }
}
