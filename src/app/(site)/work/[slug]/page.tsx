import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import ProjectCard from "@/components/work/ProjectCard";
import VideoPlayer from "@/components/work/VideoPlayer";
import { getProjectBySlug, getProjects } from "@/lib/projects";
import JsonLd from "@/components/seo/JsonLd";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import { categoryName } from "@/lib/types";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

// Pre-render published projects; new ones render on demand and are cached (revalidate).
export async function generateStaticParams() {
  const all = await getProjects();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) return { title: "Project not found" };
  const description = p.description?.slice(0, 160) ?? `${categoryName(p.category)} by Prominence Creative.`;
  return {
    title: p.title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} | Prominence Creative`, description, url: `/work/${p.slug}`, images: p.thumbnail_url ? [p.thumbnail_url] : undefined },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) notFound();

  const idx = all.findIndex((p) => p.id === project.id);
  const next = all.length > 1 ? all[(idx + 1) % all.length] : null;
  const sameCategory = all.filter((p) => p.id !== project.id && p.category === project.category);
  const related = [...sameCategory, ...all.filter((p) => p.id !== project.id && p.category !== project.category)].slice(0, 3);

  const meta = [
    { k: "Client", v: project.client_name },
    { k: "Service", v: categoryName(project.category) },
    { k: "Year", v: project.project_year ? String(project.project_year) : null },
  ].filter((m) => m.v);

  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url: absoluteUrl(`/work/${project.slug}`),
    genre: categoryName(project.category),
    creator: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    ...(project.description ? { description: project.description } : {}),
    ...(project.thumbnail_url ? { image: project.thumbnail_url } : {}),
    ...(project.project_year ? { dateCreated: String(project.project_year) } : {}),
  };

  return (
    <article className="bg-bg pt-40 md:pt-52">
      <JsonLd data={ld} />
      <div className="container-x">
        <Link href="/work" className="micro transition-colors hover:!text-white">← All work</Link>
        <Reveal>
          <h1 className="h-display mt-8 max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)]">{project.title}</h1>
        </Reveal>
        <dl className="mt-14 grid gap-6 border-y border-line py-6 sm:grid-cols-3">
          {meta.map((m) => (
            <div key={m.k}>
              <dt className="micro">{m.k}</dt>
              <dd className="mt-2 text-sm text-white">{m.v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14">
          {project.video_url ? (
            <VideoPlayer url={project.video_url} poster={project.thumbnail_url} title={project.title} />
          ) : project.thumbnail_url ? (
            <div className="relative aspect-video overflow-hidden bg-bg-3">
              <Image src={project.thumbnail_url} alt={project.title} fill priority sizes="(min-width: 1440px) 1360px, 100vw" className="object-cover" />
            </div>
          ) : (
            <MediaPlaceholder label="Project media not added" className="aspect-video w-full" />
          )}
        </div>

        {(project.description || project.creative_objective || project.production_approach) && (
          <div className="mt-28 grid gap-16 md:grid-cols-12">
            {project.description && (
              <Reveal className="md:col-span-5">
                <p className="micro">Overview</p>
                <p className="mt-6 text-lg leading-relaxed text-fg-2">{project.description}</p>
              </Reveal>
            )}
            <div className="space-y-14 md:col-span-6 md:col-start-7">
              {project.creative_objective && (
                <Reveal>
                  <p className="micro">Creative objective</p>
                  <p className="mt-4 text-base leading-relaxed text-fg-2">{project.creative_objective}</p>
                </Reveal>
              )}
              {project.production_approach && (
                <Reveal>
                  <p className="micro">Production approach</p>
                  <p className="mt-4 text-base leading-relaxed text-fg-2">{project.production_approach}</p>
                </Reveal>
              )}
            </div>
          </div>
        )}

        {project.gallery_urls.length > 0 && (
          <section className="mt-28" aria-label="Gallery">
            <p className="micro mb-8">Gallery</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {project.gallery_urls.map((src, i) => (
                <div key={src} className={`relative overflow-hidden bg-bg-3 ${i % 3 === 0 ? "aspect-[16/10] sm:col-span-2" : "aspect-[4/5]"}`}>
                  <Image src={src} alt={`${project.title}, image ${i + 1}`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
          </section>
        )}

        {project.deliverables.length > 0 && (
          <section className="mt-28 grid gap-8 md:grid-cols-12" aria-label="Deliverables">
            <p className="micro md:col-span-5">Deliverables</p>
            <ul className="divide-y divide-line border-y border-line text-base text-fg-2 md:col-span-6 md:col-start-7">
              {project.deliverables.map((d) => (<li key={d} className="py-4">{d}</li>))}
            </ul>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-32 border-t border-line py-24" aria-label="Related projects">
          <div className="container-x">
            <p className="micro mb-12">Related projects</p>
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
              {related.map((p) => (<ProjectCard key={p.id} project={p} ratio="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" />))}
            </div>
          </div>
        </section>
      )}

      {next ? (
        <Link href={`/work/${next.slug}`} className="group block border-t border-line bg-bg-2 py-24 md:py-32">
          <div className="container-x">
            <p className="micro">Next project</p>
            <p className="h-display mt-6 text-[clamp(2rem,6vw,5.5rem)] transition-transform duration-500 group-hover:translate-x-3">{next.title} →</p>
          </div>
        </Link>
      ) : (
        <div className="border-t border-line bg-bg-2 py-24">
          <div className="container-x"><Button href="/contact">Start a project ↗</Button></div>
        </div>
      )}
    </article>
  );
}
