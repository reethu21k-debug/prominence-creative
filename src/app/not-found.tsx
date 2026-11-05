import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-x flex min-h-[100svh] flex-col justify-center py-24">
      <p className="micro">404</p>
      <h1 className="h-display mt-6 text-[clamp(2.5rem,7vw,6rem)]">Page not found.</h1>
      <p className="mt-6 max-w-md text-fg-2">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="micro !text-white mt-10 inline-block w-fit border-b border-white/40 pb-2 hover:border-white">Back to home</Link>
    </main>
  );
}
