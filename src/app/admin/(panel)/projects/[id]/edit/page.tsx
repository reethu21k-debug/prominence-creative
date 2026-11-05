import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { UUID } from "@/lib/admin/project-input";
import type { Project } from "@/lib/types";
import ProjectForm from "@/components/admin/ProjectForm";

export const metadata: Metadata = { title: "Edit project" };
export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const project = data as Project;
  return (
    <div>
      <p className="micro">Projects</p>
      <h1 className="h-display mb-12 mt-4 text-4xl md:text-5xl">{project.title}</h1>
      <ProjectForm project={project} />
    </div>
  );
}
