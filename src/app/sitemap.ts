import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/content";
import { getProjects } from "@/lib/projects";
import { absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const pages = ["/", "/work", "/services", "/about", "/contact"].map((p) => ({ url: absoluteUrl(p) }));
  const services = SERVICES.map((s) => ({ url: absoluteUrl(`/services/${s.slug}`) }));
  const work = projects.map((p) => ({
    url: absoluteUrl(`/work/${p.slug}`),
    lastModified: new Date(p.updated_at ?? p.created_at),
  }));
  return [...pages, ...services, ...work];
}
