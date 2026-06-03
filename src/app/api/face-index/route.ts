import { NextResponse } from "next/server";
import { indexFaceInCollection } from "@/lib/rekognition";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;
    const photoId = formData.get("photoId") as string;

    if (!image || !photoId) {
      return NextResponse.json(
        { error: "Image file and photoId are required" },
        { status: 400 }
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Call AWS Rekognition to index the faces in this photo
    const result = await indexFaceInCollection(uint8Array, photoId);

    return NextResponse.json({ 
      success: true, 
      facesIndexed: result.FaceRecords?.length || 0 
    });
  } catch (error) {
    console.error("Error indexing face:", error);
    return NextResponse.json(
      { error: "Failed to index faces" },
      { status: 500 }
    );
  }
}
