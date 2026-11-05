"use client";
import { useState } from "react";
import { btnOutline } from "./styles";

export default function ConfirmDelete({ id, title, action }: { id: string; title: string; action: (fd: FormData) => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return <button type="button" onClick={() => setConfirming(true)} className={btnOutline}>Delete</button>;
  }
  return (
    <form action={action} className="flex flex-wrap items-center gap-2" role="alertdialog" aria-label={`Delete ${title}?`}>
      <input type="hidden" name="id" value={id} />
      <span className="text-xs text-fg-2">Delete “{title}” permanently?</span>
      <button className="bg-white px-4 py-3 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-bg hover:bg-fg-2">Confirm</button>
      <button type="button" onClick={() => setConfirming(false)} className={btnOutline}>Cancel</button>
    </form>
  );
}
