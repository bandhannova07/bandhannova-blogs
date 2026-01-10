import { NextRequest, NextResponse } from "next/server";
import { generateBlogWithAI, generateBlogMetadata } from "@/lib/ai-blog-generator";

export async function POST(request: NextRequest) {
    try {
        const { topic, category } = await request.json();

        if (!topic || !category) {
            return NextResponse.json(
                { error: "Topic and category are required" },
                { status: 400 }
            );
        }

        // Generate blog content using AI
        const content = await generateBlogWithAI(topic, category);

        // Generate metadata
        const metadata = await generateBlogMetadata(content);

        return NextResponse.json({
            content,
            metadata,
            success: true,
        });
    } catch (error) {
        console.error("Error in generate-blog API:", error);
        return NextResponse.json(
            { error: "Failed to generate blog post" },
            { status: 500 }
        );
    }
}
