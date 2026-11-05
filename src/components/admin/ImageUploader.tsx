"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { getUploadSignature } from "@/app/admin/(panel)/uploads";
import { btnOutline } from "./styles";

const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 10 * 1024 * 1024;

async function uploadOne(file: File): Promise<string> {
  if (!TYPES.includes(file.type)) throw new Error(`${file.name}: use JPG, PNG, WebP or AVIF.`);
  if (file.size > MAX_BYTES) throw new Error(`${file.name}: larger than 10 MB.`);
  const t = await getUploadSignature("image");
  if (!t.ok) throw new Error(t.error);
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", t.apiKey);
  body.append("timestamp", String(t.timestamp));
  body.append("folder", t.folder);
  body.append("signature", t.signature);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${t.cloud}/image/upload`, { method: "POST", body });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.secure_url) throw new Error(json?.error?.message ?? `${file.name}: upload failed.`);
  return json.secure_url as string;
}

type Props = { name: string; label: string; initial: string[]; max: number; error?: string };

export default function ImageUploader({ name, label, initial, max, error }: Props) {
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const single = max === 1;

  async function onPick(files: FileList | null) {
    if (!files?.length) return;
    setMsg(null);
    setBusy(true);
    const room = max - urls.length + (single ? urls.length : 0);
    const picked = Array.from(files).slice(0, Math.max(room, 0));
    const added: string[] = [];
    const errs: string[] = [];
    for (const f of picked) {
      try { added.push(await uploadOne(f)); } catch (e) { errs.push(e instanceof Error ? e.message : "Upload failed."); }
    }
    if (added.length) setUrls((u) => (single ? added.slice(0, 1) : [...u, ...added]));
    if (files.length > picked.length) errs.push(`Only ${max} image${max > 1 ? "s" : ""} allowed.`);
    if (errs.length) setMsg(errs.join(" "));
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  const move = (i: number, d: number) =>
    setUrls((u) => { const c = [...u]; const j = i + d; if (j < 0 || j >= c.length) return c; [c[i], c[j]] = [c[j], c[i]]; return c; });

  return (
    <div>
      <p className="micro">{label}</p>
      <input type="hidden" name={name} value={urls.join("\n")} />
      {urls.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {urls.map((u, i) => (
            <li key={u} className="border border-line">
              <div className="relative aspect-[4/3] bg-bg-3">
                <Image src={u} alt={`${label} ${i + 1}`} fill sizes="200px" className="object-cover" />
              </div>
              <div className="flex items-center justify-between gap-1 p-2 text-xs">
                <span className="flex gap-1">
                  {!single && (<>
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move earlier" className="px-2 py-1 text-fg-2 hover:text-white disabled:opacity-30">←</button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === urls.length - 1} aria-label="Move later" className="px-2 py-1 text-fg-2 hover:text-white disabled:opacity-30">→</button>
                  </>)}
                </span>
                <button type="button" onClick={() => setUrls((x) => x.filter((y) => y !== u))} className="px-2 py-1 text-fg-2 hover:text-white">Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex items-center gap-4">
        <button type="button" disabled={busy || (!single && urls.length >= max)} onClick={() => input.current?.click()} className={btnOutline}>
          {busy ? "Uploading..." : urls.length && single ? "Replace" : "Upload"}
        </button>
        <input ref={input} type="file" accept={TYPES.join(",")} multiple={!single} className="sr-only" tabIndex={-1} onChange={(e) => onPick(e.target.files)} />
        <span className="text-xs text-muted">JPG, PNG, WebP or AVIF, up to 10 MB each.</span>
      </div>
      {(msg || error) && <p role="alert" className="mt-3 text-sm text-white">{msg ?? error}</p>}
    </div>
  );
}
