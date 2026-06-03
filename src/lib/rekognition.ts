import { RekognitionClient, IndexFacesCommand, SearchFacesByImageCommand } from "@aws-sdk/client-rekognition";

const rekognitionClient = new RekognitionClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function indexFaceInCollection(imageBytes: Uint8Array, externalImageId: string) {
  const command = new IndexFacesCommand({
    CollectionId: process.env.AWS_REKOGNITION_COLLECTION_ID!,
    Image: { Bytes: imageBytes },
    ExternalImageId: externalImageId, // We can store the Supabase photo ID here
    DetectionAttributes: ["DEFAULT"],
    MaxFaces: 10,
    QualityFilter: "AUTO",
  });

  return rekognitionClient.send(command);
}

export async function searchFacesByImage(selfieBytes: Uint8Array) {
  const command = new SearchFacesByImageCommand({
    CollectionId: process.env.AWS_REKOGNITION_COLLECTION_ID!,
    Image: { Bytes: selfieBytes },
    MaxFaces: 100, // Maximum matches to return
    FaceMatchThreshold: 90, // Minimum confidence score (90%)
  });

  return rekognitionClient.send(command);
}
