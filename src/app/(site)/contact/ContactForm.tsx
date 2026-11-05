"use client";
import { useActionState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { submitEnquiry } from "./actions";
import { SERVICE_OPTIONS, type Field, type FormState } from "@/lib/enquiry";

const initial: FormState = { status: "idle" };

const input =
  "w-full border-0 border-b border-line bg-transparent py-3 text-base text-white placeholder:text-muted transition-colors focus:border-white focus:outline-none";

function Row({ label, name, error, required, children }: { label: string; name: Field; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="micro block">
        {label}{required ? "" : " (optional)"}
      </label>
      <div className="mt-1">{children}</div>
      {error && <p id={`${name}-error`} role="alert" className="mt-2 text-sm text-white">{error}</p>}
    </div>
  );
}

export default function ContactForm({ defaultService }: { defaultService?: string }) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);

  if (state.status === "success") {
    return (
      <div role="status" className="border border-line p-10 md:p-14">
        <Check size={28} aria-hidden="true" />
        <h2 className="h-display mt-8 text-3xl md:text-4xl">Thank you.</h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-fg-2">
          We have received your enquiry and will get back to you using the email or phone number you provided.
        </p>
        <Link href="/" className="micro !text-white mt-10 inline-block border-b border-white/40 pb-2 hover:border-white">Back to home</Link>
      </div>
    );
  }

  const v = state.values ?? {};
  const e = state.errors ?? {};
  const a = (n: Field) => ({
    id: n, name: n, "aria-invalid": e[n] ? true : undefined, "aria-describedby": e[n] ? `${n}-error` : undefined,
  });

  return (
    <form action={action} noValidate className="space-y-10">
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <div className="grid gap-10 sm:grid-cols-2">
        <Row label="Full name" name="full_name" required error={e.full_name}>
          <input {...a("full_name")} type="text" autoComplete="name" defaultValue={v.full_name} className={input} />
        </Row>
        <Row label="Company / Brand" name="company" error={e.company}>
          <input {...a("company")} type="text" autoComplete="organization" defaultValue={v.company} className={input} />
        </Row>
        <Row label="Email" name="email" required error={e.email}>
          <input {...a("email")} type="email" autoComplete="email" defaultValue={v.email} className={input} />
        </Row>
        <Row label="Phone number" name="phone" required error={e.phone}>
          <input {...a("phone")} type="tel" autoComplete="tel" defaultValue={v.phone} className={input} />
        </Row>
      </div>

      <Row label="Service required" name="service" required error={e.service}>
        <div className="relative">
        <select {...a("service")} defaultValue={v.service ?? defaultService ?? ""} className={`${input} appearance-none`}>
          <option value="" disabled className="bg-bg">Select a service</option>
          {SERVICE_OPTIONS.map((o) => (<option key={o} value={o} className="bg-bg">{o}</option>))}
        </select>
        <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-muted" />
        </div>
      </Row>

      <Row label="Project details" name="project_details" required error={e.project_details}>
        <textarea {...a("project_details")} rows={5} defaultValue={v.project_details} className={`${input} resize-y`} placeholder="What are you making, and what should it achieve?" />
      </Row>

      <div className="grid gap-10 sm:grid-cols-2">
        <Row label="Estimated budget" name="budget" error={e.budget}>
          <input {...a("budget")} type="text" defaultValue={v.budget} className={input} />
        </Row>
        <Row label="Reference links" name="reference_links" error={e.reference_links}>
          <input {...a("reference_links")} type="text" defaultValue={v.reference_links} className={input} placeholder="Links to videos or styles you like" />
        </Row>
      </div>

      {state.status === "error" && state.message && <p role="alert" className="border border-line p-4 text-sm text-white">{state.message}</p>}

      <button
        type="submit" disabled={pending}
        className="inline-flex w-full items-center justify-center bg-white px-8 py-5 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-fg-2 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : "Send enquiry ↗"}
      </button>
    </form>
  );
}
