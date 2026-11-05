"use server";
import { assertAdmin } from "@/lib/auth";
import { cloudinaryConfig, signParams } from "@/lib/cloudinary";

export type UploadTicket =
  | { ok: true; cloud: string; apiKey: string; timestamp: number; folder: string; signature: string; resource: "image" | "video" }
  | { ok: false; error: string };

// Signs a Cloudinary upload for the browser. The API secret never leaves the server.
export async function getUploadSignature(resource: "image" | "video"): Promise<UploadTicket> {
  try { await assertAdmin(); } catch { return { ok: false, error: "You are not authorised." }; }
  if (resource !== "image" && resource !== "video") return { ok: false, error: "Invalid upload type." };
  const cfg = cloudinaryConfig();
  if (!cfg) return { ok: false, error: "Cloudinary is not configured on this deployment." };

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "prominence/projects";
  const signature = signParams({ folder, timestamp }, cfg.secret);
  return { ok: true, cloud: cfg.cloud, apiKey: cfg.key, timestamp, folder, signature, resource };
}
