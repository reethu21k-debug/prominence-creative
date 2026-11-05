export default function Loading() {
  return (
    <div className="container-x pb-32 pt-40 md:pt-52" aria-busy="true">
      <div className="h-24 w-2/3 animate-pulse bg-bg-3" />
      <div className="mt-20 grid gap-6 md:grid-cols-12">
        <div className="aspect-[16/10] animate-pulse bg-bg-3 md:col-span-7" />
        <div className="aspect-[4/5] animate-pulse bg-bg-3 md:col-span-5" />
      </div>
    </div>
  );
}
