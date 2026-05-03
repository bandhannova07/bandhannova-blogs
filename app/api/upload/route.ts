import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary directly here to ensure it's initialized with server-side env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: NextRequest) {
    console.log("Upload API: Request received");
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const type = formData.get("type") as string || "thumbnail";

        if (!file) {
            console.log("Upload API: No file provided");
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        console.log(`Upload API: Processing file of type ${file.type}, size ${file.size} bytes`);

        // Convert file to Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

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

        console.log(`Upload API: Uploading to Cloudinary folder ${folder}...`);

        // Upload to Cloudinary using a Promise to wrap the upload_stream
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Stream Error:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            uploadStream.end(buffer);
        });

        console.log("Upload API: Upload successful");
        return NextResponse.json({ 
            url: (uploadResult as any).secure_url, 
            success: true 
        });
    } catch (error: any) {
        console.error("Upload API: Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload file" },
            { status: 500 }
        );
    }
}
