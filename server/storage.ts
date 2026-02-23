/**
 * Cloudflare R2 Storage Helpers
 * S3-compatible object storage via @aws-sdk/client-s3
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { ENV } from './_core/env';

let _client: S3Client | null = null;

function getR2Client(): S3Client {
  if (_client) return _client;

  const endpoint = ENV.r2Endpoint;
  const accessKeyId = ENV.r2AccessKeyId;
  const secretAccessKey = ENV.r2SecretAccessKey;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 credentials missing: set R2_ENDPOINT, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY"
    );
  }

  _client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return _client;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

/**
 * Upload file to Cloudflare R2
 * Returns the public URL for the uploaded file
 */
export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const client = getR2Client();
  const key = normalizeKey(relKey);
  const bucket = ENV.r2BucketName;

  const body = typeof data === "string" ? Buffer.from(data) : data;

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  // Build public URL using R2.dev public URL
  const publicUrl = ENV.r2PublicUrl.replace(/\/+$/, "");
  const url = `${publicUrl}/${key}`;

  return { key, url };
}

/**
 * Get public URL for a file in R2
 */
export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const publicUrl = ENV.r2PublicUrl.replace(/\/+$/, "");
  return {
    key,
    url: `${publicUrl}/${key}`,
  };
}

/**
 * Delete a file from R2
 */
export async function storageDelete(relKey: string): Promise<void> {
  const client = getR2Client();
  const key = normalizeKey(relKey);
  const bucket = ENV.r2BucketName;

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}
