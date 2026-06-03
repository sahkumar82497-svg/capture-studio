import { NextResponse } from "next/server";
import { searchFacesByImage } from "@/lib/rekognition";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Call AWS Rekognition to search for matching faces
    const result = await searchFacesByImage(uint8Array);
    
    // Extract the matched photo IDs from ExternalImageId
    const matches = result.FaceMatches?.map(match => ({
      photoId: match.Face?.ExternalImageId,
      confidence: match.Similarity
    })).filter(match => match.photoId) || [];

    // The frontend will then query Supabase for these photoIds to get the CDN URLs

    return NextResponse.json({ 
      success: true, 
      matches 
    });
  } catch (error) {
    console.error("Error searching face:", error);
    return NextResponse.json(
      { error: "Failed to search faces" },
      { status: 500 }
    );
  }
}
