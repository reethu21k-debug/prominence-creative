export function slugify(input: string): string {
  const s = input
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
    .slice(0, 60).replace(/-+$/g, "");
  return s || "project";
}

// Picks `base`, then base-2, base-3 ... avoiding anything in `taken`.
export function uniqueSlug(base: string, taken: Set<string>): string {
  if (!taken.has(base)) return base;
  for (let i = 2; i < 1000; i++) {
    const c = `${base}-${i}`;
    if (!taken.has(c)) return c;
  }
  return `${base}-${Date.now().toString(36)}`;
}
