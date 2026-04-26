import { NextRequest, NextResponse } from "next/server";
import { generateBlogWithAI, generateBlogMetadata } from "@/lib/ai-blog-generator";
import { scrapeUrl } from "@/lib/scraper";
import { categories } from "@/lib/blog-data";

export async function POST(request: NextRequest) {
    try {
        const { topic, category, sources } = await request.json();

        if (!topic) {
            return NextResponse.json(
                { error: "Topic is required" },
                { status: 400 }
            );
        }

        // Scrape or use provided source content
        const scrapedSources = sources && sources.length > 0 
            ? await Promise.all(sources.map(async (s: any) => {
                const url = typeof s === 'string' ? s : s.url;
                const content = (typeof s === 'object' && s.content) ? s.content : await scrapeUrl(url);
                return { url, content };
            }))
            : [];
 
        // Generate blog content using AI
        const content = await generateBlogWithAI(topic, category, [...categories], scrapedSources);

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
