import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectCard, { GRID_PATTERN } from "@/components/work/ProjectCard";
import WorkVideos from "@/components/work/WorkVideos";
import { getProjects } from "@/lib/projects";

export default async function SelectedWork() {
  // Featured, published projects from Supabase (shown below the videos once you add some).
  const featured = await getProjects({ featured: true, limit: 5 });

  return (
    <section className="bg-bg-2 py-28 md:py-44">
      <div className="container-x">
        <Reveal className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div>
            <SectionLabel>02 / Selected work</SectionLabel>
            <h2 className="h-display mt-8 text-[clamp(2.25rem,5.5vw,5rem)]">Our work.<br />Their stories.</h2>
          </div>
          <p className="max-w-xs text-base leading-relaxed text-fg-2">A selection of visual experiences crafted for brands, businesses and creators.</p>
        </Reveal>

        <Reveal className="mt-20">
          <WorkVideos />
        </Reveal>

        {featured.length > 0 && (
          <div className="mt-24 grid gap-x-6 gap-y-16 md:grid-cols-12 md:items-start">
            {featured.map((p, i) => {
              const pat = GRID_PATTERN[i % GRID_PATTERN.length];
              return (
                <Reveal key={p.id} delay={(i % 3) * 0.08} className={`${pat.span} ${pat.offset}`}>
                  <ProjectCard project={p} ratio={pat.ratio} />
                </Reveal>
              );
            })}
          </div>
        )}

        <Reveal className="mt-20">
          <Link href="/work" className="micro !text-white border-b border-white/40 pb-2 transition-colors hover:border-white">View all work ↗</Link>
        </Reveal>
      </div>
    </section>
  );
}