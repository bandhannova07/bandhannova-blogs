import { NextRequest, NextResponse } from "next/server";
import { uploadThumbnail, uploadWriterAvatar, uploadBrandVideo, uploadProductImage, uploadBlogImage } from "@/lib/bfobs-storage";

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

        let url: string;

        switch (type) {
            case "thumbnail":
                url = await uploadThumbnail(file);
                break;
            case "avatar":
                url = await uploadWriterAvatar(file);
                break;
            case "brand_video":
                url = await uploadBrandVideo(file);
                break;
            case "product_image":
                url = await uploadProductImage(file);
                break;
            case "blog_image":
                url = await uploadBlogImage(file);
                break;
            default:
                url = await uploadThumbnail(file);
        }

        return NextResponse.json({ url, success: true });
    } catch (error: any) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload file" },
            { status: 500 }
        );
    }
}
