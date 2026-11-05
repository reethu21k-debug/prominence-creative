import { PHONES } from "@/lib/content";

const text = encodeURIComponent("Hello Prominence Creative, I would like to discuss a project.");

export default function WhatsAppButtons() {
  return (
    <div className="flex flex-col gap-3">
      {PHONES.map((p) => (
        <a
          key={p}
          href={`https://wa.me/${p.replace(/\D/g, "")}?text=${text}`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-between border border-white/40 px-5 py-4 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-bg"
        >
          WhatsApp {p}<span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}
