import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { UUID } from "@/lib/admin/project-input";
import { btnOutline, fmtDate } from "@/components/admin/styles";
import StatusBadge from "@/components/admin/StatusBadge";
import { setEnquiryStatus } from "../actions";

export const metadata: Metadata = { title: "Enquiry" };
export const dynamic = "force-dynamic";

type Enquiry = {
  id: string; full_name: string; company: string | null; email: string; phone: string; service: string;
  budget: string | null; project_details: string; reference_links: string | null; status: string; created_at: string;
};

export default async function EnquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!UUID.test(id)) notFound();
  const { data } = await supabase.from("enquiries").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const e = data as Enquiry;

  const fields: [string, React.ReactNode][] = [
    ["Company", e.company ?? "—"],
    ["Email", <a key="m" href={`mailto:${e.email}`} className="underline underline-offset-4">{e.email}</a>],
    ["Phone", <a key="p" href={`tel:${e.phone.replace(/[^\d+]/g, "")}`} className="underline underline-offset-4">{e.phone}</a>],
    ["Service", e.service],
    ["Budget", e.budget ?? "—"],
    ["Received", fmtDate(e.created_at)],
  ];

  return (
    <div className="max-w-3xl">
      <Link href="/admin/enquiries" className="micro transition-colors hover:!text-white">← All enquiries</Link>
      <h1 className="h-display mt-8 text-4xl md:text-5xl">{e.full_name}</h1>
      <div className="mt-4"><StatusBadge on={e.status === "new"} onLabel="New" offLabel={e.status} /></div>

      <dl className="mt-12 grid gap-6 border-y border-line py-8 sm:grid-cols-2">
        {fields.map(([k, val]) => (
          <div key={k}><dt className="micro">{k}</dt><dd className="mt-2 break-words text-sm">{val}</dd></div>
        ))}
      </dl>

      <section className="mt-10">
        <p className="micro">Project details</p>
        <p className="mt-4 whitespace-pre-wrap break-words text-base leading-relaxed text-fg-2">{e.project_details}</p>
      </section>
      {e.reference_links && (
        <section className="mt-10">
          <p className="micro">Reference links</p>
          <p className="mt-4 whitespace-pre-wrap break-words text-sm text-fg-2">{e.reference_links}</p>
        </section>
      )}

      <section className="mt-14 border-t border-line pt-8">
        <p className="micro">Set status</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(["new", "contacted", "converted"] as const).map((s) => (
            <form key={s} action={setEnquiryStatus}>
              <input type="hidden" name="id" value={e.id} /><input type="hidden" name="status" value={s} />
              <button disabled={e.status === s} aria-pressed={e.status === s} className={`${btnOutline} ${e.status === s ? "!bg-white !text-bg" : ""}`}>{s}</button>
            </form>
          ))}
        </div>
      </section>
    </div>
  );
}
