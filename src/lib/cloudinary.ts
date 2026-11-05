import "server-only";
import { createHash } from "node:crypto";

export function cloudinaryConfig() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  return cloud && key && secret ? { cloud, key, secret } : null;
}

// Cloudinary signature: SHA-1 of the sorted "k=v&k=v" params string plus the API secret.
export function signParams(params: Record<string, string | number>, secret: string): string {
  const str = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  return createHash("sha1").update(str + secret).digest("hex");
}

// Only accept media that lives in OUR Cloudinary account.
export function isOwnCloudinaryUrl(value: string): boolean {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloud) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && u.hostname === "res.cloudinary.com" && u.pathname.startsWith(`/${cloud}/`);
  } catch {
    return false;
  }
}

const OUR_FOLDER = "prominence/projects/";

// https://res.cloudinary.com/<cloud>/<image|video>/upload/[transforms/]v123/prominence/projects/x.jpg
// -> { type: "image", publicId: "prominence/projects/x" }. Null unless it is in OUR folder.
export function parseCloudinaryAsset(value: string): { type: "image" | "video"; publicId: string } | null {
  if (!isOwnCloudinaryUrl(value)) return null;
  const m = new URL(value).pathname.match(/^\/[^/]+\/(image|video)\/upload\/(?:.*?\/)?(?:v\d+\/)?(prominence\/projects\/[^/]+?)(?:\.[a-z0-9]+)?$/i);
  if (!m || !m[2].startsWith(OUR_FOLDER)) return null;
  return { type: m[1].toLowerCase() as "image" | "video", publicId: decodeURIComponent(m[2]) };
}

// Best-effort: never throws. Returns how many assets Cloudinary confirmed as deleted.
export async function destroyAssets(urls: (string | null | undefined)[]): Promise<number> {
  const cfg = cloudinaryConfig();
  if (!cfg) return 0;
  const assets = urls.flatMap((u) => (u ? [parseCloudinaryAsset(u)] : [])).filter((a): a is NonNullable<typeof a> => !!a);
  let deleted = 0;
  await Promise.all(assets.map(async (a) => {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const body = new URLSearchParams({
        public_id: a.publicId, timestamp: String(timestamp), api_key: cfg.key,
        signature: signParams({ public_id: a.publicId, timestamp }, cfg.secret),
      });
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloud}/${a.type}/destroy`, { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { result?: string };
      if (res.ok && json.result === "ok") deleted++;
      else console.error("destroyAssets:", a.publicId, res.status, json.result);
    } catch (e) {
      console.error("destroyAssets failed:", a.publicId, e);
    }
  }));
  return deleted;
}
