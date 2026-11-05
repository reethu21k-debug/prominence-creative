import { SERVICES } from "./content";
import type { CategoryKey } from "./types";

// Descriptive copy only. No claims, figures or client results.
const EXTRA: Record<string, { category: CategoryKey; detail: string }> = {
  "product-shoots": {
    category: "product-shoots",
    detail:
      "Every product has details worth showing: material, finish, scale and the way it sits in a space. We plan each shoot around what the product needs to communicate, then photograph and film it with controlled lighting and a consistent visual language. Editing brings stills and video together into assets ready for your website, catalogue and campaigns.",
  },
  "meta-ad-creatives": {
    category: "meta-ads",
    detail:
      "An ad works when its message is clear in the first moments. We develop creatives for Facebook and Instagram that suit the formats and pacing of those platforms, from talking-head ads to short promotional videos, and deliver variations your marketing team can run and compare.",
  },
  "ai-video-production": {
    category: "ai-videos",
    detail:
      "AI workflows let us create presenters, virtual models and concepts that would be difficult or costly to shoot conventionally. We pair them with creative direction and careful editing, so the result feels considered rather than automated.",
  },
  "social-media-editing": {
    category: "social-media",
    detail:
      "Raw footage becomes content people watch to the end. We edit for the platform it will live on, with pacing, captions and motion graphics suited to Reels and Shorts, and can deliver content as packages for regular posting.",
  },
  "podcast-production": {
    category: "podcasts",
    detail:
      "A podcast is a conversation, and production should make it easy to follow and worth watching. We film with multiple cameras, edit picture and sound, and cut clips and promotional videos for the platforms where episodes are shared.",
  },
};

export const SERVICE_LIST = SERVICES.map((s) => ({ ...s, ...EXTRA[s.slug] }));
export const getService = (slug: string) => SERVICE_LIST.find((s) => s.slug === slug) ?? null;
