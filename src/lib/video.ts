export type VideoSource = { kind: "embed" | "file"; src: string; poster?: string };

export function parseVideo(url: string): VideoSource {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) {
    return {
      kind: "embed",
      src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`,
      poster: `https://i.ytimg.com/vi/${yt[1]}/hqdefault.jpg`, // host is allowed in next.config.ts
    };
  }
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return { kind: "embed", src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1` };
  return { kind: "file", src: url };
}
