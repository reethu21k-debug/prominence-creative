import Link from "next/link";

type Props = { href: string; children: React.ReactNode; variant?: "solid" | "outline"; className?: string };

export default function Button({ href, children, variant = "solid", className = "" }: Props) {
  const base =
    "inline-flex items-center justify-center px-7 py-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300";
  const styles =
    variant === "solid"
      ? "bg-white text-bg hover:bg-fg-2"
      : "border border-white/40 text-white hover:border-white hover:bg-white hover:text-bg";
  return <Link href={href} className={`${base} ${styles} ${className}`}>{children}</Link>;
}
