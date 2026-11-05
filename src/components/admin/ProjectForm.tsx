"use client";
import { useActionState } from "react";
import Link from "next/link";
import { saveProject } from "@/app/admin/(panel)/projects/actions";
import { CATEGORIES, type Project } from "@/lib/types";
import type { ProjectFormState } from "@/lib/admin/project-input";
import ImageUploader from "./ImageUploader";
import { btnOutline, btnSolid, inputCls } from "./styles";

const initial: ProjectFormState = {};

function Row({ label, name, error, hint, children }: { label: string; name: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="micro block">{label}</label>
      <div className="mt-1">{children}</div>
      {hint && !error && <p className="mt-2 text-xs text-muted">{hint}</p>}
      {error && <p id={`${name}-error`} role="alert" className="mt-2 text-sm text-white">{error}</p>}
    </div>
  );
}

export default function ProjectForm({ project }: { project?: Project }) {
  const [state, action, pending] = useActionState(saveProject, initial);
  const e = state.errors ?? {};
  // After a failed save, show what the admin typed; otherwise the saved project.
  const v = (k: string, fallback: string) => state.values?.[k] ?? fallback;
  const a = (n: string) => ({ id: n, name: n, "aria-invalid": e[n] ? true : undefined, "aria-describedby": e[n] ? `${n}-error` : undefined });
  const checked = (k: "featured" | "published") => (state.values ? state.values[k] === "on" : project?.[k] ?? false);

  return (
    <form action={action} noValidate className="max-w-3xl space-y-10">
      {project && <input type="hidden" name="id" value={project.id} />}

      <Row label="Title" name="title" error={e.title}>
        <input {...a("title")} type="text" required defaultValue={v("title", project?.title ?? "")} className={inputCls} />
      </Row>
      {project
        ? <p className="micro">Slug: /work/{project.slug} (kept stable so links do not break)</p>
        : <p className="text-xs text-muted">The URL slug is generated from the title.</p>}

      <div className="grid gap-10 sm:grid-cols-2">
        <Row label="Client name" name="client_name" error={e.client_name}>
          <input {...a("client_name")} type="text" defaultValue={v("client_name", project?.client_name ?? "")} className={inputCls} />
        </Row>
        <Row label="Year" name="project_year" error={e.project_year}>
          <input {...a("project_year")} type="number" inputMode="numeric" defaultValue={v("project_year", project?.project_year?.toString() ?? "")} className={inputCls} />
        </Row>
      </div>

      <Row label="Category" name="category" error={e.category}>
        <select {...a("category")} defaultValue={v("category", project?.category ?? "")} className={`${inputCls} appearance-none`}>
          <option value="" disabled className="bg-bg">Select a category</option>
          {CATEGORIES.map((c) => (<option key={c.key} value={c.key} className="bg-bg">{c.full}</option>))}
        </select>
      </Row>

      <Row label="Description" name="description" error={e.description}>
        <textarea {...a("description")} rows={4} defaultValue={v("description", project?.description ?? "")} className={`${inputCls} resize-y`} />
      </Row>
      <Row label="Creative objective" name="creative_objective" error={e.creative_objective}>
        <textarea {...a("creative_objective")} rows={4} defaultValue={v("creative_objective", project?.creative_objective ?? "")} className={`${inputCls} resize-y`} />
      </Row>
      <Row label="Production approach" name="production_approach" error={e.production_approach}>
        <textarea {...a("production_approach")} rows={4} defaultValue={v("production_approach", project?.production_approach ?? "")} className={`${inputCls} resize-y`} />
      </Row>
      <Row label="Deliverables" name="deliverables" error={e.deliverables} hint="One per line.">
        <textarea {...a("deliverables")} rows={5} defaultValue={v("deliverables", project?.deliverables.join("\n") ?? "")} className={`${inputCls} resize-y`} />
      </Row>

      <Row label="Video URL" name="video_url" error={e.video_url} hint="YouTube, Vimeo, or a direct https link to a video file (for example a Cloudinary video URL).">
        <input {...a("video_url")} type="url" defaultValue={v("video_url", project?.video_url ?? "")} className={inputCls} />
      </Row>

      <ImageUploader
        name="thumbnail_url" label="Thumbnail" max={1} error={e.thumbnail_url}
        initial={(state.values ? state.values.thumbnail_url : project?.thumbnail_url) ? [state.values?.thumbnail_url ?? project?.thumbnail_url ?? ""] : []}
      />
      <ImageUploader
        name="gallery_urls" label="Gallery" max={12} error={e.gallery_urls}
        initial={state.values ? state.values.gallery_urls.split("\n").filter(Boolean) : project?.gallery_urls ?? []}
      />

      <fieldset className="flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-8">
        <legend className="micro sr-only">Visibility</legend>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="published" defaultChecked={checked("published")} className="h-4 w-4 accent-white" /> Published
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="featured" defaultChecked={checked("featured")} className="h-4 w-4 accent-white" /> Featured on homepage
        </label>
      </fieldset>

      {state.error && <p role="alert" className="border border-line p-4 text-sm text-white">{state.error}</p>}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className={btnSolid}>{pending ? "Saving..." : project ? "Save changes" : "Create project"}</button>
        <Link href="/admin/projects" className={btnOutline}>Cancel</Link>
      </div>
    </form>
  );
}
