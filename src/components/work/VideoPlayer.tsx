"use client";
import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import MediaPlaceholder from "@/components/ui/MediaPlaceholder";
import { parseVideo } from "@/lib/video";

// Loads nothing until clicked, so several players on a page never autoplay together.
export default function VideoPlayer({ url, poster, title }: { url: string; poster?: string | null; title: string }) {
  const [playing, setPlaying] = useState(false);
  const video = parseVideo(url);
  const posterSrc = poster ?? video.poster ?? null;

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-bg-3">
      {playing ? (
        video.kind === "embed" ? (
          <iframe src={video.src} title={title} className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        ) : (
          <video src={video.src} className="absolute inset-0 h-full w-full" controls autoPlay playsInline poster={posterSrc ?? undefined} preload="none" />
        )
      ) : (
        <button onClick={() => setPlaying(true)} className="group absolute inset-0" aria-label={`Play ${title}`}>
          {posterSrc ? (
            <Image src={posterSrc} alt="" fill sizes="(min-width: 1024px) 80vw, 100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]" />
          ) : (
            <MediaPlaceholder label="Poster not added" className="h-full w-full" />
          )}
          <span className="absolute inset-0 bg-black/30" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/70 transition-colors group-hover:bg-white group-hover:text-bg">
            <Play size={20} fill="currentColor" aria-hidden="true" />
          </span>
        </button>
      )}
    </div>
  );
}
