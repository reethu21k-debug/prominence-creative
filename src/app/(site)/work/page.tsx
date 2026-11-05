import type { Metadata } from "next";
import Reveal from "@/components/ui/Reveal";
import WorkGrid from "@/components/work/WorkGrid";
import WorkVideos from "@/components/work/WorkVideos";
import { getProjects } from "@/lib/projects";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Selected Work",
  description: "A collection of ideas transformed into visual experiences: product shoots, ad creatives, AI video, social content and podcasts.",
  openGraph: { title: "Selected Work | Prominence Creative", url: "/work" },
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <section className="bg-bg pb-32 pt-40 md:pt-52">
      <div className="container-x">
        <Reveal className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <h1 className="h-display text-[clamp(2.5rem,9vw,8rem)]">Selected<br />work.</h1>
          <p className="max-w-xs text-base leading-relaxed text-fg-2">A collection of ideas transformed into visual experiences.</p>
        </Reveal>

        <WorkVideos />

        {projects.length > 0 && (
          <div className="mt-24">
            <WorkGrid projects={projects} />
          </div>
        )}
      </div>
    </section>
  );
}