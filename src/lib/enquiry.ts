import { SERVICES } from "./content";

export type Field =
  | "full_name" | "company" | "email" | "phone"
  | "service" | "budget" | "project_details" | "reference_links";

export type Values = Record<Field, string>;

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<Field, string>>;
  values?: Partial<Values>;
};

export const SERVICE_OPTIONS = [...SERVICES.map((s) => s.title), "Not sure yet"];

export function validate(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (v.full_name.length < 2) e.full_name = "Enter your full name.";
  if (v.full_name.length > 100) e.full_name = "Keep your name under 100 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) || v.email.length > 200) e.email = "Enter a valid email address.";
  const digits = v.phone.replace(/\D/g, "").length;
  if (!/^[+\d][\d\s()-]*$/.test(v.phone) || digits < 7 || digits > 15) e.phone = "Enter a valid phone number.";
  if (!SERVICE_OPTIONS.includes(v.service)) e.service = "Select a service.";
  if (v.project_details.length < 10) e.project_details = "Tell us a little more about the project.";
  if (v.project_details.length > 4000) e.project_details = "Keep project details under 4,000 characters.";
  if (v.company.length > 150) e.company = "Keep this under 150 characters.";
  if (v.budget.length > 100) e.budget = "Keep this under 100 characters.";
  if (v.reference_links.length > 1000) e.reference_links = "Keep this under 1,000 characters.";
  return e;
}
