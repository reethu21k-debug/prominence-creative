export type CategoryKey = "product-shoots" | "meta-ads" | "ai-videos" | "social-media" | "podcasts";

export const CATEGORIES: { key: CategoryKey; label: string; full: string }[] = [
  { key: "product-shoots", label: "Product Shoots", full: "Product Shoot & Editing" },
  { key: "meta-ads", label: "Meta Ads", full: "Meta Ad Creatives" },
  { key: "ai-videos", label: "AI Videos", full: "AI-Powered Video Production" },
  { key: "social-media", label: "Social Media", full: "Social Media Video Editing" },
  { key: "podcasts", label: "Podcasts", full: "Podcast Production" },
];

export const categoryName = (key: string) => CATEGORIES.find((c) => c.key === key)?.full ?? key;

export type Project = {
  id: string;
  title: string;
  slug: string;
  client_name: string | null;
  category: CategoryKey;
  description: string | null;
  creative_objective: string | null;
  production_approach: string | null;
  project_year: number | null;
  thumbnail_url: string | null;
  video_url: string | null;
  gallery_urls: string[];
  deliverables: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string | null;
};
