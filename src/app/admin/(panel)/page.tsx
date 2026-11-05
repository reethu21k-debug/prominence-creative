import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Re-check here: layouts do not re-run on client-side navigation.
  const { supabase } = await requireAdmin();

  const count = (table: string, filter?: [string, string | boolean]) => {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    return q;
  };

  const [all, published, enquiries, fresh] = await Promise.all([
    count("projects"),
    count("projects", ["published", true]),
    count("enquiries"),
    count("enquiries", ["status", "new"]),
  ]);

  const failed = [all, published, enquiries, fresh].some((r) => r.error);
  const n = (r: { count: number | null; error: unknown }) => (r.error || r.count === null ? "—" : String(r.count));
  const drafts = all.error || published.error || all.count === null || published.count === null ? "—" : String(all.count - published.count);

  const stats = [
    { label: "Total projects", value: n(all) },
    { label: "Published", value: n(published) },
    { label: "Drafts", value: drafts },
    { label: "Total enquiries", value: n(enquiries) },
    { label: "New enquiries", value: n(fresh) },
  ];

  return (
    <div>
      <p className="micro">Overview</p>
      <h1 className="h-display mt-4 text-4xl md:text-5xl">Dashboard</h1>

      {failed && (
        <p role="alert" className="mt-8 max-w-xl border border-line p-4 text-sm text-white">
          Some figures could not be loaded. Check that supabase/admin-policies.sql has been run and your admin row exists.
        </p>
      )}

      <dl className="mt-12 grid border-l border-t border-line sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="border-b border-r border-line p-6">
            <dt className="micro">{s.label}</dt>
            <dd className="h-display mt-6 text-5xl">{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
