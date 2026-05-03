import { NextRequest, NextResponse } from "next/server";
import { getAllAuthors, createAuthor } from "@/lib/blog-service";

export async function GET() {
    try {
        const authors = await getAllAuthors();
        return NextResponse.json({ authors });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const author = await createAuthor(body);
        return NextResponse.json({ author, success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
