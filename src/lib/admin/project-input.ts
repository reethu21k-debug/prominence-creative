import { CATEGORIES } from "@/lib/types";
import { isOwnCloudinaryUrl } from "@/lib/cloudinary";

export type ProjectFormState = {
  error?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export type ProjectInput = {
  title: string; client_name: string | null; category: string; project_year: number | null;
  description: string | null; creative_objective: string | null; production_approach: string | null;
  deliverables: string[]; video_url: string | null; thumbnail_url: string | null; gallery_urls: string[];
  featured: boolean; published: boolean;
};

export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const lines = (s: string) => [...new Set(s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean))];

export function parseProject(fd: FormData): { data?: ProjectInput; errors?: Record<string, string>; values: Record<string, string> } {
  const get = (k: string) => String(fd.get(k) ?? "").trim();
  const values: Record<string, string> = {};
  for (const k of ["title", "client_name", "category", "project_year", "description", "creative_objective", "production_approach", "deliverables", "video_url", "thumbnail_url", "gallery_urls"]) values[k] = get(k);
  values.featured = fd.get("featured") ? "on" : "";
  values.published = fd.get("published") ? "on" : "";

  const e: Record<string, string> = {};
  const v = values;

  if (v.title.length < 2 || v.title.length > 150) e.title = "Title must be 2 to 150 characters.";
  if (v.client_name.length > 150) e.client_name = "Keep the client name under 150 characters.";
  if (!CATEGORIES.some((c) => c.key === v.category)) e.category = "Select a category.";

  let year: number | null = null;
  if (v.project_year) {
    year = Number(v.project_year);
    const max = new Date().getFullYear() + 1;
    if (!Number.isInteger(year) || year < 1990 || year > max) e.project_year = `Enter a year between 1990 and ${max}.`;
  }

  if (v.description.length > 2000) e.description = "Keep the description under 2,000 characters.";
  if (v.creative_objective.length > 3000) e.creative_objective = "Keep this under 3,000 characters.";
  if (v.production_approach.length > 3000) e.production_approach = "Keep this under 3,000 characters.";

  const deliverables = lines(v.deliverables);
  if (deliverables.length > 20) e.deliverables = "Add at most 20 deliverables.";
  else if (deliverables.some((d) => d.length > 120)) e.deliverables = "Keep each deliverable under 120 characters.";

  if (v.video_url) {
    try {
      const u = new URL(v.video_url);
      if (u.protocol !== "https:" || v.video_url.length > 500) throw new Error();
    } catch {
      e.video_url = "Enter a valid https video link (YouTube, Vimeo or a direct file).";
    }
  }

  if (v.thumbnail_url && !isOwnCloudinaryUrl(v.thumbnail_url)) e.thumbnail_url = "Thumbnail must be uploaded through this form.";
  const gallery = lines(v.gallery_urls);
  if (gallery.length > 12) e.gallery_urls = "Add at most 12 gallery images.";
  else if (gallery.some((g) => !isOwnCloudinaryUrl(g))) e.gallery_urls = "Gallery images must be uploaded through this form.";

  if (Object.keys(e).length) return { errors: e, values };

  return {
    values,
    data: {
      title: v.title, client_name: v.client_name || null, category: v.category, project_year: year,
      description: v.description || null, creative_objective: v.creative_objective || null,
      production_approach: v.production_approach || null, deliverables,
      video_url: v.video_url || null, thumbnail_url: v.thumbnail_url || null, gallery_urls: gallery,
      featured: !!v.featured, published: !!v.published,
    },
  };
}
