/**
 * src/s3.js
 * ─────────────────────────────────────────────────────────────────
 * AWS S3 helper module for JayxCreatez Productions.
 *
 * Reads config from environment variables:
 *   S3_BUCKET_NAME  – e.g. photographers-suite-storage
 *   S3_REGION       – e.g. us-east-1
 *   AWS_ACCESS_KEY_ID     (optional — uses IAM role / instance profile if absent)
 *   AWS_SECRET_ACCESS_KEY (optional — same)
 *
 * Exports:
 *   getS3Client()          – singleton S3Client
 *   getUploadUrl(key, contentType, expiresIn?)
 *     → { uploadUrl, key, publicUrl } — presigned PUT URL for direct browser upload
 *   getSignedDownloadUrl(key, expiresIn?)
 *     → string presigned GET URL
 *   deleteS3Object(key)
 *     → void
 *   buildFolderUrl(prefix)
 *     → canonical https URL for a folder / prefix (used as the delivery link)
 * ─────────────────────────────────────────────────────────────────
 */

import {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

// ── Singleton client ──────────────────────────────────────────────
let _client = null;

export function getS3Client() {
  if (_client) return _client;

  const region = process.env.S3_REGION || "us-east-1";

  // Credentials are optional — SDK picks them up automatically from:
  //   env vars → ~/.aws/credentials → EC2/ECS instance profile
  const config = { region };

  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    config.credentials = {
      accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      ...(process.env.AWS_SESSION_TOKEN ? { sessionToken: process.env.AWS_SESSION_TOKEN } : {}),
    };
  }

  _client = new S3Client(config);
  return _client;
}

// ── Config helpers ────────────────────────────────────────────────
function getBucket() {
  const bucket = process.env.S3_BUCKET_NAME;
  if (!bucket) throw new Error("S3_BUCKET_NAME is not set in environment.");
  return bucket;
}

function getRegion() {
  return process.env.S3_REGION || "us-east-1";
}

// ── Presigned PUT — browser uploads directly to S3 ───────────────
/**
 * Generate a presigned PUT URL so the browser can upload a file
 * directly to S3 without routing the bytes through the backend.
 *
 * @param {string} key          – S3 object key, e.g. "deliverables/jxc-001/photo.jpg"
 * @param {string} contentType  – MIME type, e.g. "image/jpeg"
 * @param {number} [expiresIn]  – URL TTL in seconds (default 15 min)
 * @returns {Promise<{ uploadUrl: string, key: string, publicUrl: string }>}
 */
export async function getUploadUrl(key, contentType, expiresIn = 900) {
  const bucket = getBucket();
  const command = new PutObjectCommand({
    Bucket:      bucket,
    Key:         key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(getS3Client(), command, { expiresIn });
  const publicUrl = buildObjectUrl(bucket, key);
  return { uploadUrl, key, publicUrl };
}

// ── Presigned GET — time-limited download link ────────────────────
/**
 * Generate a presigned GET URL for a private S3 object.
 *
 * @param {string} key
 * @param {number} [expiresIn] – URL TTL in seconds (default 7 days)
 * @returns {Promise<string>}
 */
export async function getSignedDownloadUrl(key, expiresIn = 604800) {
  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key:    key,
  });
  return getSignedUrl(getS3Client(), command, { expiresIn });
}

// ── Delete ────────────────────────────────────────────────────────
/**
 * Delete a single object from S3.
 * Silently ignores "NoSuchKey" — idempotent.
 *
 * @param {string} key
 */
export async function deleteS3Object(key) {
  try {
    await getS3Client().send(
      new DeleteObjectCommand({ Bucket: getBucket(), Key: key })
    );
  } catch (err) {
    if (err.name !== "NoSuchKey") throw err;
  }
}

// ── URL helpers ───────────────────────────────────────────────────
/**
 * Canonical HTTPS URL for a specific object key.
 * Works for public buckets / CloudFront; for private buckets use
 * getSignedDownloadUrl() instead.
 */
function buildObjectUrl(bucket, key) {
  return `https://${bucket}.s3.${getRegion()}.amazonaws.com/${key}`;
}

/**
 * Returns a URL representing an S3 "folder" (key prefix).
 * This is stored as the delivery link in the DB.
 *
 * @param {string} prefix – e.g. "deliverables/jxc-001/"
 * @returns {string}
 */
export function buildFolderUrl(prefix) {
  const bucket = getBucket();
  return `https://${bucket}.s3.${getRegion()}.amazonaws.com/${prefix}`;
}

/**
 * Derive a clean S3 key prefix from an appointment id.
 * e.g. "jxc-001" → "deliverables/jxc-001/"
 *
 * @param {string} appointmentId
 * @returns {string}
 */
export function buildDeliveryPrefix(appointmentId) {
  const safe = appointmentId.replace(/[^a-zA-Z0-9_\-]/g, "_");
  return `deliverables/${safe}/`;
}
