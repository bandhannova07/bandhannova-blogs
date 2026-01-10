import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { passkey } = await request.json();
    const cookieStore = await cookies();

    const step1Verified = cookieStore.get("admin_step1");
    if (!step1Verified || step1Verified.value !== "verified") {
      return NextResponse.json(
        { error: "Please complete email/password login first" },
        { status: 401 }
      );
    }

    const validPasskey = process.env.ADMIN_PASSKEY;

    if (passkey !== validPasskey) {
      return NextResponse.json(
        { error: "Invalid passkey" },
        { status: 401 }
      );
    }

    cookieStore.delete("admin_step1");
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Passkey verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
