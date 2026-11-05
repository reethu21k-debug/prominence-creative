"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import ProjectCard, { GRID_PATTERN } from "./ProjectCard";
import { CATEGORIES, type CategoryKey, type Project } from "@/lib/types";

export default function WorkGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<"all" | CategoryKey>("all");
  const filters = [{ key: "all" as const, label: "All" }, ...CATEGORIES.map((c) => ({ key: c.key, label: c.label }))];
  const visible = useMemo(() => (active === "all" ? projects : projects.filter((p) => p.category === active)), [active, projects]);

  return (
    <div>
      <div role="group" aria-label="Filter projects" className="-mx-6 flex gap-8 overflow-x-auto border-b border-line px-6 md:mx-0 md:px-0">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            aria-pressed={active === f.key}
            className={`micro relative shrink-0 whitespace-nowrap py-4 transition-colors hover:!text-white ${active === f.key ? "!text-white" : ""}`}
          >
            {f.label}
            {active === f.key && <motion.span layoutId="work-filter" className="absolute inset-x-0 -bottom-px h-px bg-white" />}
          </button>
        ))}
      </div>

      {projects.length === 0 ? (
        <p className="mt-20 max-w-md text-base leading-relaxed text-fg-2">Projects will appear here once they are published.</p>
      ) : visible.length === 0 ? (
        <p className="mt-20 max-w-md text-base leading-relaxed text-fg-2">No projects in this category yet. Try another filter.</p>
      ) : (
        <div key={active} className="mt-16 grid gap-x-6 gap-y-16 md:grid-cols-12 md:items-start">
          {visible.map((p, i) => {
            const pat = GRID_PATTERN[i % GRID_PATTERN.length];
            return (
              <Reveal key={p.id} delay={(i % 3) * 0.06} className={`${pat.span} ${pat.offset}`}>
                <ProjectCard project={p} ratio={pat.ratio} priority={i < 2} />
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
