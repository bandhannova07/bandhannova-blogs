
import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/bfobs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { sql, params } = body;

        if (!sql) {
            return NextResponse.json({ error: "SQL query is required" }, { status: 400 });
        }

        const result = await executeQuery(sql, params || []);
        return NextResponse.json({ result, success: true });
    } catch (error: any) {
        console.error("SQL Execution Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to execute SQL" },
            { status: 500 }
        );
    }
}
