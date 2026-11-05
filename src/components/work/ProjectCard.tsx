import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { categoryName, type Project } from "@/lib/types";

export const GRID_PATTERN = [
  { span: "md:col-span-7", ratio: "aspect-[16/10]", offset: "" },
  { span: "md:col-span-5", ratio: "aspect-[4/5]", offset: "md:mt-20" },
  { span: "md:col-span-4", ratio: "aspect-[4/5]", offset: "" },
  { span: "md:col-span-4", ratio: "aspect-[4/5]", offset: "md:mt-16" },
  { span: "md:col-span-4", ratio: "aspect-[4/5]", offset: "md:mt-32" },
];

export default function ProjectCard({ project, ratio, priority = false, sizes = "(min-width: 768px) 50vw, 100vw" }: { project: Project; ratio: string; priority?: boolean; sizes?: string }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className={`relative overflow-hidden bg-bg-3 ${ratio}`}>
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <MediaPlaceholder label="Thumbnail not added" className="h-full w-full" />
        )}
        {project.video_url && (
          <span className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center border border-white/60 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <Play size={14} fill="currentColor" aria-hidden="true" />
            <span className="sr-only">Video project</span>
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="font-display text-lg font-medium tracking-tight transition-transform duration-300 group-hover:translate-x-1">{project.title}</p>
          {project.client_name && <p className="micro mt-2">{project.client_name}</p>}
        </div>
        <p className="micro text-right">
          {categoryName(project.category)}
          {project.project_year ? <><br />{project.project_year}</> : null}
        </p>
      </div>
    </Link>
  );
}
