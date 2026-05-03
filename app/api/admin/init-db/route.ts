import { NextResponse } from "next/server";
import { initDatabase } from "@/lib/blog-service";

export async function POST() {
    try {
        await initDatabase();
        return NextResponse.json({ success: true, message: "Database initialized/synced successfully" });
    } catch (error: any) {
        console.error("Database init error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
