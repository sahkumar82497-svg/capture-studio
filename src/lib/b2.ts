import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: "auto", // Backblaze uses a specific region but for S3 API it's usually defined by endpoint
  endpoint: `https://s3.${process.env.B2_REGION || "us-west-004"}.backblazeb2.com`,
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

export async function getUploadPresignedUrl(fileName: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.B2_BUCKET_NAME!,
    Key: fileName,
    ContentType: contentType,
  });

  // URL expires in 15 minutes
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  const cdnUrl = `${process.env.B2_CDN_URL}/${fileName}`;

  return { uploadUrl, cdnUrl };
}
