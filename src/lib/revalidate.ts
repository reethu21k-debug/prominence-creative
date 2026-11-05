import { revalidatePath } from "next/cache";

// Public pages that show project data. Call after any project mutation.
export function revalidateProjects(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/work");
  if (slug) revalidatePath(`/work/${slug}`);
  revalidatePath("/services/[slug]", "page");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}
