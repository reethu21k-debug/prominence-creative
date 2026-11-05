export default function Loading() {
  return (
    <div aria-busy="true">
      <div className="h-10 w-48 animate-pulse bg-bg-3" />
      <div className="mt-10 grid gap-px sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-32 animate-pulse bg-bg-3" />))}
      </div>
    </div>
  );
}
