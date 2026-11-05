import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { CategoryKey, Project } from "./types";

// Public, read-only client. RLS also restricts anonymous reads to published rows.
function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function getProjects(opts: { featured?: boolean; category?: CategoryKey; limit?: number } = {}): Promise<Project[]> {
  const c = client();
  if (!c) return [];
  let q = c.from("projects").select("*").eq("published", true).order("created_at", { ascending: false });
  if (opts.featured) q = q.eq("featured", true);
  if (opts.category) q = q.eq("category", opts.category);
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) {
    console.error("getProjects:", error.message);
    return [];
  }
  return (data ?? []) as Project[];
}

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const c = client();
  if (!c) return null;
  const { data, error } = await c.from("projects").select("*").eq("slug", slug).eq("published", true).maybeSingle();
  if (error) console.error("getProjectBySlug:", error.message);
  return (data as Project | null) ?? null;
});
