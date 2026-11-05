import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { categoryName } from "@/lib/types";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import StatusBadge from "@/components/admin/StatusBadge";
import { btnOutline, btnSolid } from "@/components/admin/styles";
import { deleteProject, setFeatured, setPublished } from "./actions";

export const metadata: Metadata = { title: "Projects" };
export const dynamic = "force-dynamic";

type Row = { id: string; title: string; slug: string; category: string; client_name: string | null; project_year: number | null; published: boolean; featured: boolean };

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { supabase } = await requireAdmin();
  const { saved } = await searchParams;
  const { data, error } = await supabase
    .from("projects")
    .select("id,title,slug,category,client_name,project_year,published,featured")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="micro">Manage</p>
          <h1 className="h-display mt-4 text-4xl md:text-5xl">Projects</h1>
        </div>
        <Link href="/admin/projects/new" className={btnSolid}>Add project</Link>
      </div>

      {saved && <p role="status" className="mt-8 border border-line p-4 text-sm">Project saved.</p>}
      {error && <p role="alert" className="mt-8 border border-line p-4 text-sm">Projects could not be loaded. Check admin-policies.sql has been run.</p>}

      {!error && rows.length === 0 ? (
        <div className="mt-12 border border-line p-10">
          <p className="text-fg-2">No projects yet. Add your first project to show it on the work page.</p>
        </div>
      ) : (
        <ul className="mt-12 divide-y divide-line border-y border-line">
          {rows.map((p) => (
            <li key={p.id} className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="font-display text-lg font-medium tracking-tight">{p.title}</p>
                <p className="micro mt-2">{categoryName(p.category)}{p.client_name ? ` / ${p.client_name}` : ""}{p.project_year ? ` / ${p.project_year}` : ""}</p>
                <div className="mt-3 flex gap-2">
                  <StatusBadge on={p.published} onLabel="Published" offLabel="Draft" />
                  {p.featured && <StatusBadge on onLabel="Featured" offLabel="" />}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href={`/admin/projects/${p.id}/edit`} className={btnOutline}>Edit</Link>
                <form action={setPublished}>
                  <input type="hidden" name="id" value={p.id} /><input type="hidden" name="value" value={String(!p.published)} />
                  <button className={btnOutline}>{p.published ? "Unpublish" : "Publish"}</button>
                </form>
                <form action={setFeatured}>
                  <input type="hidden" name="id" value={p.id} /><input type="hidden" name="value" value={String(!p.featured)} />
                  <button className={btnOutline}>{p.featured ? "Unfeature" : "Feature"}</button>
                </form>
                <ConfirmDelete id={p.id} title={p.title} action={deleteProject} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
