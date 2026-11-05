import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin | Prominence Creative", template: "%s | Admin" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-bg">{children}</div>;
}
