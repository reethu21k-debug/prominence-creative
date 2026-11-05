"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-6 md:flex-col md:gap-1">
      {ITEMS.map((i) => {
        const active = i.href === "/admin" ? path === "/admin" : path.startsWith(i.href);
        return (
          <Link
            key={i.href} href={i.href} aria-current={active ? "page" : undefined}
            className={`micro py-3 transition-colors hover:!text-white md:border-l md:pl-4 ${active ? "!text-white md:border-white" : "md:border-line"}`}
          >
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
