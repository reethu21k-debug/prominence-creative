"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-x pb-32 pt-48">
      <h1 className="h-display text-4xl">Something went wrong.</h1>
      <p className="mt-6 max-w-md text-fg-2">The work could not be loaded. Check your connection and try again.</p>
      <button onClick={reset} className="mt-8 border border-white/40 px-7 py-4 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-bg">Try again</button>
    </div>
  );
}
