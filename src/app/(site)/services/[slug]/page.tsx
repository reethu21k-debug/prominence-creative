import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import ProcessOverview from "@/components/services/ProcessOverview";
import ProjectCard from "@/components/work/ProjectCard";
import { getProjects } from "@/lib/projects";
import { SERVICE_LIST, getService } from "@/lib/services";

export const revalidate = 60;
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SERVICE_LIST.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return { title: "Service not found" };
  return {
    title: s.title,
    description: s.description,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: `${s.title} | Prominence Creative`, description: s.description, url: `/services/${s.slug}` },
  };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const samples = await getProjects({ category: service.category, limit: 3 });
  const idx = SERVICE_LIST.findIndex((s) => s.slug === slug);
  const next = SERVICE_LIST[(idx + 1) % SERVICE_LIST.length];

  return (
    <article>
      <section className="bg-bg pb-20 pt-40 md:pt-52">
        <div className="container-x">
          <Link href="/services" className="micro transition-colors hover:!text-white">← All services</Link>
          <Reveal>
            <p className="micro mt-10">{service.n}</p>
            <h1 className="h-display mt-6 max-w-5xl text-[clamp(2.5rem,7vw,6.5rem)]">{service.title}</h1>
            <p className="mt-10 max-w-xl text-lg leading-relaxed text-fg-2">{service.description}</p>
          </Reveal>
          <div className="mt-16">
            <MediaPlaceholder label={`${service.title} showcase`} className="aspect-[16/9] w-full" />
          </div>
        </div>
      </section>

      <section className="bg-bg pb-28">
        <div className="container-x grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="micro">What this involves</p>
            <p className="mt-6 text-base leading-relaxed text-fg-2">{service.detail}</p>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <p className="micro">Deliverables</p>
            <ul className="mt-6 divide-y divide-line border-y border-line text-base text-fg-2">
              {service.deliverables.map((d) => (<li key={d} className="py-4">{d}</li>))}
            </ul>
          </Reveal>
        </div>
      </section>

      {samples.length > 0 && (
        <section className="border-t border-line bg-bg py-24" aria-label="Work samples">
          <div className="container-x">
            <div className="mb-12 flex items-end justify-between">
              <p className="micro">Work samples</p>
              <Link href="/work" className="micro !text-white border-b border-white/40 pb-1 hover:border-white">View all work ↗</Link>
            </div>
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
              {samples.map((p) => (<ProjectCard key={p.id} project={p} ratio="aspect-[4/3]" sizes="(min-width: 768px) 33vw, 100vw" />))}
            </div>
          </div>
        </section>
      )}

      <ProcessOverview />

      <section className="bg-bg py-28 md:py-40">
        <div className="container-x flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <h2 className="h-display text-[clamp(2.25rem,6vw,5.5rem)]">Interested in<br />{service.title}?</h2>
          <Button href={`/contact?service=${service.slug}`}>Enquire about this service ↗</Button>
        </div>
      </section>

      <Link href={`/services/${next.slug}`} className="group block border-t border-line bg-bg-2 py-20 md:py-28">
        <div className="container-x">
          <p className="micro">Next service</p>
          <p className="h-display mt-6 text-[clamp(1.75rem,5vw,4.5rem)] transition-transform duration-500 group-hover:translate-x-3">{next.title} →</p>
        </div>
      </Link>
    </article>
  );
}
