const raw =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const SITE_URL = raw.replace(/\/+$/, "");
export const SITE_NAME = "Prominence Creative";
export const absoluteUrl = (path = "") => `${SITE_URL}${path.startsWith("/") || !path ? path : `/${path}`}`;
