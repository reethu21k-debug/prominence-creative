"use server";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { validate, type FormState, type Values } from "@/lib/enquiry";

async function notify(v: Values) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  const to = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (!key || !from || !to) return; // notifications not configured
  const text = [
    `Name: ${v.full_name}`, `Company: ${v.company || "-"}`, `Email: ${v.email}`, `Phone: ${v.phone}`,
    `Service: ${v.service}`, `Budget: ${v.budget || "-"}`, `References: ${v.reference_links || "-"}`,
    "", v.project_details,
  ].join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, reply_to: v.email, subject: `New enquiry: ${v.full_name}`, text }),
  });
  if (!res.ok) console.error("notify: Resend responded", res.status);
}

export async function submitEnquiry(_prev: FormState, formData: FormData): Promise<FormState> {
  const get = (k: string) => String(formData.get(k) ?? "").trim();

  // Honeypot: real visitors never fill this hidden field.
  if (get("website")) return { status: "success" };

  const values: Values = {
    full_name: get("full_name"), company: get("company"), email: get("email"), phone: get("phone"),
    service: get("service"), budget: get("budget"), project_details: get("project_details"),
    reference_links: get("reference_links"),
  };

  const errors = validate(values);
  if (Object.keys(errors).length) {
    return { status: "error", errors, values, message: "Please check the highlighted fields." };
  }

  // Rate limit: 5 submissions per IP per 10 minutes (best effort, per server instance).
  const limited = rateLimit(`enquiry:${clientIp(await headers())}`, 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return { status: "error", values, message: "Too many submissions. Please wait a few minutes, or call us." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("submitEnquiry: Supabase environment variables are missing.");
    return { status: "error", values, message: "The form is unavailable right now. Please call or message us on WhatsApp." };
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // Database-backed check that survives restarts: max 3 enquiries per email per hour.
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("enquiries").select("id", { count: "exact", head: true })
    .eq("email", values.email.toLowerCase()).gte("created_at", since);
  if ((count ?? 0) >= 3) {
    return { status: "error", values, message: "We already have your recent enquiries and will be in touch. Please call us if it is urgent." };
  }

  const { error } = await supabase.from("enquiries").insert({
    ...values,
    email: values.email.toLowerCase(),
    company: values.company || null,
    budget: values.budget || null,
    reference_links: values.reference_links || null,
  });
  if (error) {
    console.error("submitEnquiry:", error.message);
    return { status: "error", values, message: "We could not send your enquiry. Please try again, or call us." };
  }

  try { await notify(values); } catch (e) { console.error("notify failed:", e); }
  return { status: "success" };
}
