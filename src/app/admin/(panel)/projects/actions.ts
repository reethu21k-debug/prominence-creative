"use server";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth";
import { parseProject, UUID, type ProjectFormState } from "@/lib/admin/project-input";
import { slugify, uniqueSlug } from "@/lib/slug";
import { revalidateProjects } from "@/lib/revalidate";
import { destroyAssets } from "@/lib/cloudinary";
import type { SupabaseClient } from "@supabase/supabase-js";

async function freeSlug(supabase: SupabaseClient, title: string) {
  const base = slugify(title);
  const { data } = await supabase.from("projects").select("slug").like("slug", `${base}%`);
  return uniqueSlug(base, new Set((data ?? []).map((r: { slug: string }) => r.slug)));
}

export async function saveProject(_prev: ProjectFormState, fd: FormData): Promise<ProjectFormState> {
  let admin;
  try { admin = await assertAdmin(); } catch { return { error: "You are not authorised to do this." }; }
  const { supabase } = admin;

  const id = String(fd.get("id") ?? "");
  if (id && !UUID.test(id)) return { error: "Invalid project." };

  const { data, errors, values } = parseProject(fd);
  if (!data) return { errors, values, error: "Please check the highlighted fields." };

  let slug: string;
  if (id) {
    const { data: row, error } = await supabase.from("projects").update(data).eq("id", id).select("slug").maybeSingle();
    if (error || !row) {
      console.error("saveProject update:", error?.message);
      return { values, error: "Could not save the project. It may have been deleted." };
    }
    slug = row.slug;
  } else {
    slug = await freeSlug(supabase, data.title);
    let res = await supabase.from("projects").insert({ ...data, slug }).select("slug").single();
    if (res.error?.code === "23505") {
      // Lost a race for the slug: retry once with a random suffix.
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      res = await supabase.from("projects").insert({ ...data, slug }).select("slug").single();
    }
    if (res.error) {
      console.error("saveProject insert:", res.error.message);
      return { values, error: "Could not save the project. Please try again." };
    }
  }

  revalidateProjects(slug);
  redirect("/admin/projects?saved=1");
}

async function toggle(fd: FormData, column: "published" | "featured") {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "");
  if (!UUID.test(id)) throw new Error("Invalid project.");
  const value = String(fd.get("value")) === "true";
  const { data, error } = await supabase.from("projects").update({ [column]: value }).eq("id", id).select("slug").maybeSingle();
  if (error || !data) throw new Error("Could not update the project.");
  revalidateProjects(data.slug);
}

export async function setPublished(fd: FormData) { await toggle(fd, "published"); }
export async function setFeatured(fd: FormData) { await toggle(fd, "featured"); }

export async function deleteProject(fd: FormData) {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "");
  if (!UUID.test(id)) throw new Error("Invalid project.");
  const { data, error } = await supabase.from("projects").delete().eq("id", id)
    .select("slug, thumbnail_url, gallery_urls").maybeSingle();
  if (error) throw new Error("Could not delete the project.");
  revalidateProjects(data?.slug);
  // Row is gone; now remove its uploaded media. Best effort: a Cloudinary failure never blocks the delete.
  if (data) await destroyAssets([data.thumbnail_url, ...(data.gallery_urls ?? [])]);
}
