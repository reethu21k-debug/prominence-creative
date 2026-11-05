"use server";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth";
import { UUID } from "@/lib/admin/project-input";

const STATUSES = ["new", "contacted", "converted"];

export async function setEnquiryStatus(fd: FormData) {
  const { supabase } = await assertAdmin();
  const id = String(fd.get("id") ?? "");
  const status = String(fd.get("status") ?? "");
  if (!UUID.test(id) || !STATUSES.includes(status)) throw new Error("Invalid request.");
  const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
  if (error) throw new Error("Could not update the enquiry.");
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}
