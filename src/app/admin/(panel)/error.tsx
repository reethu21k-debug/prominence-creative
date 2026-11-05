"use client";
export default function PanelError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert">
      <h1 className="h-display text-3xl">Something went wrong.</h1>
      <p className="mt-4 max-w-md text-fg-2">The action could not be completed. Your session may have expired, or the database is unavailable.</p>
      <button onClick={reset} className="mt-8 border border-white/40 px-7 py-4 text-[0.6875rem] uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-bg">Try again</button>
    </div>
  );
}
