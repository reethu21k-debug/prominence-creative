"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";

// WebGL only works in the browser, so skip server rendering for it.
const FlexCarousel = dynamic(() => import("./FlexCarousel"), { ssr: false }) as unknown as React.ComponentType<Record<string, unknown>>;

// Files live in /public/media (renamed to simple names).
const VIDEOS = [
  { video: "/media/social-media-video.mp4", title: "Social media video editing", subtitle: "Social Content" },
  { video: "/media/ai-model-video.mp4", title: "Realistic AI Model + Video editing", subtitle: "AI Video" },
  { video: "/media/meta-ads.mp4", title: "Meta Ads", subtitle: "Ad Creatives" },
  { video: "/media/product-shoot.mp4", title: "Product shoot & editing", subtitle: "Product Shoot" },
];

type Item = { src: string; alt: string; title: string; subtitle: string; video: string };

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
    canvas.toBlob((b) => (b ? resolve(URL.createObjectURL(b)) : reject(new Error("No image"))), "image/jpeg", 0.85)
  );
}

// Grabs one frame from a video. Gives up after 10 seconds so one bad file never blocks the rest.
function makePoster(videoSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    let done = false;
    const finish = (fn: () => void) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      v.removeAttribute("src");
      v.load();
      fn();
    };
    const timer = setTimeout(() => finish(() => reject(new Error("Timed out"))), 10000);

    v.muted = true;
    v.playsInline = true;
    v.preload = "metadata";
    v.src = videoSrc;
    v.addEventListener("error", () => finish(() => reject(new Error("Cannot load file"))), { once: true });
    v.addEventListener("loadedmetadata", () => {
      v.addEventListener("seeked", () => {
        const w = v.videoWidth, h = v.videoHeight;
        if (!w || !h) return finish(() => reject(new Error("No video size")));
        const scale = Math.min(1, 1280 / Math.max(w, h));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(w * scale));
        canvas.height = Math.max(1, Math.round(h * scale));
        canvas.getContext("2d")?.drawImage(v, 0, 0, canvas.width, canvas.height);
        canvasToUrl(canvas).then(
          (url) => finish(() => resolve(url)),
          (e) => finish(() => reject(e))
        );
      }, { once: true });
      v.currentTime = Math.min(1, (v.duration || 2) / 4); // frame at ~1 second
    }, { once: true });
  });
}

// Dark card with the title, used when a frame cannot be grabbed.
function makeFallback(title: string): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 1280;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createLinearGradient(0, 0, 720, 1280);
    g.addColorStop(0, "#1c1c1c");
    g.addColorStop(1, "#0a0a0a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 720, 1280);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 52px sans-serif";
    ctx.textAlign = "center";
    const words = title.split(" ");
    let line = "";
    let y = 600;
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > 600 && line) {
        ctx.fillText(line, 360, y);
        line = word;
        y += 66;
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
        <video src={item.video} controls autoPlay playsInline className="max-h-[82vh] max-w-full bg-black" />
        <p className="mt-4 font-display text-base tracking-tight">{item.title}</p>
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
            return { src: await makePoster(v.video), ok: true };
          } catch (e) {
            console.warn(`[WorkVideos] ${v.video}:`, (e as Error).message);
            return { src: await makeFallback(v.title), ok: false };
          }
        })
      );
      results.forEach((r) => urls.push(r.src));
      if (cancelled) return;
      setFailed(VIDEOS.filter((_, i) => !results[i].ok).map((v) => v.video));
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
          Could not read: {failed.join(", ")}. Check the file names in public/media.
        </p>
      )}
      {open && <Lightbox item={open} onClose={() => setOpen(null)} />}
    </div>
  );
}