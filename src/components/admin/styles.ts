export const inputCls =
  "w-full border-0 border-b border-line bg-transparent py-3 text-base text-white placeholder:text-muted transition-colors focus:border-white focus:outline-none";
export const btnSolid =
  "inline-flex items-center justify-center bg-white px-6 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-bg transition-colors hover:bg-fg-2 disabled:opacity-60";
export const btnOutline =
  "inline-flex items-center justify-center border border-white/40 px-5 py-3 text-[0.6875rem] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-bg disabled:opacity-60";
export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
