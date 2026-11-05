import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { fmtDate } from "@/components/admin/styles";
import StatusBadge from "@/components/admin/StatusBadge";

export const metadata: Metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

const FILTERS = ["all", "new", "contacted", "converted"] as const;
type Row = { id: string; full_name: string; company: string | null; email: string; service: string; status: string; created_at: string };

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { supabase } = await requireAdmin();
  const { status } = await searchParams;
  const active = FILTERS.find((f) => f === status) ?? "all";

  let q = supabase.from("enquiries").select("id,full_name,company,email,service,status,created_at").order("created_at", { ascending: false }).limit(200);
  if (active !== "all") q = q.eq("status", active);
  const { data, error } = await q;
  const rows = (data ?? []) as Row[];

  return (
    <div>
      <p className="micro">Inbox</p>
      <h1 className="h-display mt-4 text-4xl md:text-5xl">Enquiries</h1>

      <div role="group" aria-label="Filter by status" className="mt-10 flex gap-8 overflow-x-auto border-b border-line">
        {FILTERS.map((f) => (
          <Link key={f} href={f === "all" ? "/admin/enquiries" : `/admin/enquiries?status=${f}`} aria-current={active === f ? "page" : undefined}
            className={`micro shrink-0 border-b py-4 transition-colors hover:!text-white ${active === f ? "border-white !text-white" : "border-transparent"}`}>
            {f}
          </Link>
        ))}
      </div>

      {error && <p role="alert" className="mt-8 border border-line p-4 text-sm">Enquiries could not be loaded. Check admin-policies.sql has been run.</p>}

      {!error && rows.length === 0 ? (
        <p className="mt-12 max-w-md text-fg-2">{active === "all" ? "No enquiries yet." : `No ${active} enquiries.`}</p>
      ) : (
        <ul className="divide-y divide-line border-b border-line">
          {rows.map((r) => (
            <li key={r.id}>
              <Link href={`/admin/enquiries/${r.id}`} className="flex flex-col gap-3 py-6 transition-colors hover:bg-bg-2 md:flex-row md:items-center md:justify-between md:px-4">
                <div className="min-w-0">
                  <p className="font-display text-lg font-medium tracking-tight">{r.full_name}{r.company ? ` / ${r.company}` : ""}</p>
                  <p className="micro mt-2 normal-case tracking-normal">{r.service} / {r.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="micro">{fmtDate(r.created_at)}</span>
                  <StatusBadge on={r.status === "new"} onLabel="New" offLabel={r.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
