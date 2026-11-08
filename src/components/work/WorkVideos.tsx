"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

// WebGL only works in the browser, so skip server rendering for it.
const FlexCarousel = dynamic(() => import("./FlexCarousel"), { ssr: false }) as unknown as React.ComponentType<Record<string, unknown>>;

// YouTube Shorts. `id` is the part after /shorts/ in the link.
const VIDEOS = [
  { id: "gmoS8F4Gupw", title: "Social media video editing", subtitle: "Social Content" },
  { id: "LRnrDILSU5M", title: "Realistic AI Model + Video editing", subtitle: "AI Video" },
  { id: "NoPpzyPdz6o", title: "Meta Ads", subtitle: "Ad Creatives" },
  { id: "bl5b6aCZzxo", title: "Product shoot & editing", subtitle: "Product Shoot" },
];

type Item = { src: string; alt: string; title: string; subtitle: string; id: string };

// Carousel height and card size per screen size, so all 4 videos fit.
function useLayout() {
  const [w, setW] = useState(1280);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  if (w < 640) return { height: 480, cardHeight: 0.8, gap: 12 };   // phone
  if (w < 1024) return { height: 540, cardHeight: 0.76, gap: 14 }; // tablet
  return { height: 600, cardHeight: 0.72, gap: 16 };               // desktop
}

function canvasToUrl(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(URL.createObjectURL(b)) : reject(new Error("No image"))), "image/jpeg", 0.9)
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Cannot load image"));
    img.src = src;
  });
}

// YouTube serves a 16:9 thumbnail with the vertical Short pillarboxed in the middle.
// Crop the centre 9:16 slice so the card shows only the video frame.
// Gives up after 10 seconds so one bad thumbnail never blocks the rest.
async function makePoster(id: string): Promise<string> {
  const work = async () => {
    const sources = [
      `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
      `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    ];
    for (const src of sources) {
      try {
        const img = await loadImage(src);
        if (img.naturalWidth < 300) continue; // YouTube's tiny "no image" placeholder
        const h = img.naturalHeight;
        const cropW = Math.round((h * 9) / 16);
        const sx = Math.max(0, Math.round((img.naturalWidth - cropW) / 2));
        const canvas = document.createElement("canvas");
        canvas.width = cropW;
        canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, sx, 0, cropW, h, 0, 0, cropW, h);
        return await canvasToUrl(canvas);
      } catch {
        /* try the next size */
      }
    }
    throw new Error("No thumbnail");
  };
  return Promise.race([
    work(),
    new Promise<string>((_, reject) => setTimeout(() => reject(new Error("Timed out")), 10000)),
  ]);
}

// Light card with the title, used when a thumbnail cannot be grabbed.
function makeFallback(title: string): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, 720, 1280);
    g.addColorStop(0, "#f5f5f4");
    g.addColorStop(1, "#e6e6e4");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 720, 1280);
    ctx.fillStyle = "#0a0a0a";
    ctx.font = "500 56px 'Inter Tight', Inter, sans-serif";
    ctx.textAlign = "center";
    const words = title.split(" ");
    let line = "";
    let y = 600;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > 600 && line) {
        ctx.fillText(line, 360, y);
        line = word;
        y += 70;
      } else line = test;
    }
    ctx.fillText(line, 360, y);
  }
  return canvasToUrl(canvas);
}

function Lightbox({ item, onClose }: { item: Item; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-white/60 text-white transition-colors hover:bg-white hover:text-black"
      >
        <X size={18} aria-hidden="true" />
      </button>
      <div className="flex max-h-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {/* Vertical 9:16 player, as tall as fits the screen */}
        <iframe
          src={`https://www.youtube.com/embed/${item.id}?autoplay=1&mute=1&loop=1&playlist=${item.id}&playsinline=1&rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}`}
          title={item.title}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="aspect-[9/16] w-[min(92vw,calc(82vh*9/16))] bg-black"
        />
        <p className="mt-4 font-display text-lg font-medium tracking-[-0.03em] text-white">{item.title}</p>
        <a
          href={`https://www.youtube.com/shorts/${item.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="micro mt-2 !text-white/70 transition-colors hover:!text-white"
        >
          Not playing? Watch on YouTube ↗
        </a>
      </div>
    </div>
  );
}

export default function WorkVideos() {
  const layout = useLayout();
  const [items, setItems] = useState<Item[] | null>(null);
  const [failed, setFailed] = useState<string[]>([]);
  const [open, setOpen] = useState<Item | null>(null);

  useEffect(() => {
    let cancelled = false;
    const urls: string[] = [];

    (async () => {
      const results = await Promise.all(
        VIDEOS.map(async (v) => {
          try {
            return { src: await makePoster(v.id), ok: true };
          } catch (e) {
            console.warn(`[WorkVideos] ${v.id}:`, (e as Error).message);
            return { src: await makeFallback(v.title), ok: false };
          }
        })
      );
      results.forEach((r) => urls.push(r.src));
      if (cancelled) return;
      setFailed(VIDEOS.filter((_, i) => !results[i].ok).map((v) => v.id));
      setItems(VIDEOS.map((v, i) => ({ src: results[i].src, alt: v.title, ...v })));
    })();

    return () => {
      cancelled = true;
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  return (
    <div>
      <div className="relative w-full" style={{ height: layout.height }}>
        {items === null ? (
          <p className="micro absolute inset-0 flex items-center justify-center">Loading showreel...</p>
        ) : (
          <FlexCarousel
            items={items}
            intro="rise"
            fit="natural"
            cardHeight={layout.cardHeight}
            gap={layout.gap}
            /* Gentle curl at the edges so every card stays visible */
            lensWidth={1.2}
            lensHeight={1.2}
            tilt={0}
            roundness={1}
            bend={0.2}
            reach={0.34}
            dispersion={0.3}
            liquid={0}
            focusOnClick={false}
            captureWheel={false}
            onSelect={(_i: number, item: Item) => setOpen(item)}
          />
        )}
      </div>
      <p className="micro mt-6 text-center">Drag or swipe to explore · Tap the centre video to play</p>
      {failed.length > 0 && (
        <p className="mt-3 text-center text-xs text-muted">
          Could not load thumbnails for: {failed.join(", ")}. The videos still play when opened.
        </p>
      )}
      {open && <Lightbox item={open} onClose={() => setOpen(null)} />}
    </div>
  );
}