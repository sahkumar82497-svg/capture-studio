import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function POST(request: Request) {
  try {
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json({ error: 'Filename and contentType are required' }, { status: 400 });
    }

    const b2KeyId = process.env.B2_KEY_ID;
    const b2AppKey = process.env.B2_APPLICATION_KEY;
    const bucketName = process.env.B2_BUCKET_NAME;

    if (!b2KeyId || !b2AppKey || !bucketName) {
      return NextResponse.json({ error: 'Storage credentials missing' }, { status: 500 });
    }

    // B2 S3-compatible endpoint format is usually s3.<region>.backblazeb2.com
    // For this implementation, we assume a standard region or endpoint string
    // If B2_ENDPOINT is not provided, we fall back to a default format based on region
    const endpoint = process.env.B2_ENDPOINT || "https://s3.us-east-005.backblazeb2.com";
    const region = "us-east-005"; // Dummy or real region mapping for S3 client

    const s3Client = new S3Client({
      endpoint: endpoint,
      region: region,
      credentials: {
        accessKeyId: b2KeyId,
        secretAccessKey: b2AppKey,
      },
      // Important for B2 compatibility with AWS SDK v3
      forcePathStyle: true, 
    });

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `uploads/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
      ContentType: contentType,
    });

    // Create a presigned URL that expires in 5 minutes
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    return NextResponse.json({ url: signedUrl });
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate URL' }, { status: 500 });
  }
}
