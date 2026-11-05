import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <div className="md:flex">
      <aside className="border-b border-line px-6 py-5 md:sticky md:top-0 md:h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r md:py-10">
        <p className="font-display text-sm font-medium uppercase tracking-[0.18em]">Prominence</p>
        <p className="micro mt-1">Admin</p>
        <div className="mt-4 md:mt-12"><AdminNav /></div>
        <div className="mt-4 space-y-3 md:absolute md:bottom-10 md:left-6 md:right-6 md:mt-0">
          <Link href="/" target="_blank" className="micro block transition-colors hover:!text-white">View site ↗</Link>
          <p className="truncate text-xs text-muted" title={user.email ?? undefined}>{user.email}</p>
          <form action={signOut}>
            <button className="micro border-b border-white/40 pb-1 !text-white transition-colors hover:border-white">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-6 py-10 md:px-12 md:py-14">{children}</main>
    </div>
  );
}
