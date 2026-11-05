import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import ProjectForm from "@/components/admin/ProjectForm";

export const metadata: Metadata = { title: "New project" };

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <div>
      <p className="micro">Projects</p>
      <h1 className="h-display mb-12 mt-4 text-4xl md:text-5xl">New project</h1>
      <ProjectForm />
    </div>
  );
}
