// Browser audit: overflow at 5 widths (with the body's overflow-x clip DISABLED so hidden
// overflow is exposed), console errors, and the mobile menu + work filters.
//
//   npm i -D playwright
//   npx playwright install chromium
//   npm run build ; npm run start          (in one terminal)
//   node scripts/audit.mjs http://localhost:3000   (in another)
import { chromium } from "playwright";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const widths = [360, 390, 768, 1024, 1440];
const fixed = ["/", "/work", "/services", "/services/product-shoots", "/about", "/contact", "/admin/login", "/this-page-does-not-exist"];
let failures = 0;
const fail = (m) => { failures++; console.log("  FAIL", m); };

const browser = await chromium.launch();
const probe = await (await browser.newContext()).newPage();
await probe.goto(base + "/work");
const projectLinks = await probe.$$eval('a[href^="/work/"]', (as) => [...new Set(as.map((a) => a.getAttribute("href")))].slice(0, 2));
const pages = [...fixed, ...projectLinks];

for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 800 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  console.log(`\n== ${w}px ==`);
  for (const path of pages) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "html,body{overflow-x:visible !important}" });
    // Scroll through so reveal-on-scroll content mounts before measuring.
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
    const res = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const over = [];
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width && r.right > vw + 1 && !el.closest('[class*="overflow-x-auto"]')) over.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)} right=${Math.round(r.right)}`);
      });
      return { vw, scrollW: document.documentElement.scrollWidth, over: over.slice(0, 4) };
    });
    const bad = res.scrollW > res.vw + 1 || res.over.length;
    console.log(`${bad ? "FAIL" : "ok  "} ${path}${bad ? `  scrollWidth=${res.scrollW} vw=${res.vw} ${res.over.join(" | ")}` : ""}`);
    if (bad) failures++;
  }
  if (errors.length) { console.log("  console errors:", [...new Set(errors)].slice(0, 5)); failures++; }

  // Mobile menu (below md) / desktop nav
  await page.goto(base + "/", { waitUntil: "networkidle" });
  if (w < 768) {
    await page.getByRole("button", { name: "Open menu" }).click();
    if (await page.getByRole("navigation", { name: "Mobile" }).isVisible()) console.log("ok   mobile menu opens");
    else fail("mobile menu did not open");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    if ((await page.getByRole("navigation", { name: "Mobile" }).count()) === 0) console.log("ok   Escape closes menu");
    else fail("Escape did not close menu");
  } else {
    if (await page.getByRole("navigation", { name: "Primary" }).isVisible()) console.log("ok   desktop nav visible");
    else fail("desktop nav hidden");
  }

  // Work filters
  await page.goto(base + "/work", { waitUntil: "networkidle" });
  const filters = page.getByRole("group", { name: "Filter projects" }).getByRole("button");
  const n = await filters.count();
  for (let i = 0; i < n; i++) { await filters.nth(i).click(); await page.waitForTimeout(150); }
  if ((await filters.first().getAttribute("aria-pressed")) !== null) console.log(`ok   work filters clickable (${n})`);
  else fail("work filters missing aria-pressed");
  await ctx.close();
}
await browser.close();
console.log(failures ? `\n${failures} problem(s) found.` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
