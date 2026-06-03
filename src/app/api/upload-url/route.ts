import { NextResponse } from "next/server";
import { getUploadPresignedUrl } from "@/lib/b2";

export async function POST(req: Request) {
  try {
    const { fileName, contentType } = await req.json();

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName and contentType are required" },
        { status: 400 }
      );
    }

    // You would add auth check here to ensure only studio admins can upload
    // e.g. using Supabase auth cookies

    const { uploadUrl, cdnUrl } = await getUploadPresignedUrl(fileName, contentType);
    
    return NextResponse.json({ uploadUrl, cdnUrl });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
