export default function StatusBadge({ on, onLabel, offLabel }: { on: boolean; onLabel: string; offLabel: string }) {
  return (
    <span className={`inline-block px-2 py-1 text-[0.625rem] uppercase tracking-[0.18em] ${on ? "bg-white text-bg" : "border border-line text-fg-2"}`}>
      {on ? onLabel : offLabel}
    </span>
  );
}
