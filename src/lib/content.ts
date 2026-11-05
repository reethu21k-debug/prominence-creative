export const NAV = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const PHONES = ["+91 8778416902", "+91 9941297695"];

export const SERVICES = [
  {
    slug: "product-shoots", n: "01", title: "Product Shoot & Editing",
    description: "Showcase your products through carefully crafted photography and cinematic visuals that highlight their details, quality and identity.",
    deliverables: ["Product photography", "Commercial product videos", "Interior and lifestyle shoots", "Product showcase editing", "Promotional visuals"],
  },
  {
    slug: "meta-ad-creatives", n: "02", title: "Meta Ad Creatives",
    description: "Create compelling advertising content designed to communicate your message, capture attention and support your marketing campaigns.",
    deliverables: ["Facebook and Instagram ad creatives", "Promotional videos", "Talking-head advertisements", "Campaign videos", "Short-form advertising content"],
  },
  {
    slug: "ai-video-production", n: "03", title: "AI-Powered Video Production",
    description: "Combine creative storytelling with modern AI production workflows to create engaging visual experiences.",
    deliverables: ["Realistic AI presenters", "Virtual model videos", "AI-assisted commercial content", "Creative video concepts", "AI-enhanced visual production"],
  },
  {
    slug: "social-media-editing", n: "04", title: "Social Media Video Editing",
    description: "Transform raw footage into engaging, professionally edited content built for today's digital platforms.",
    deliverables: ["Instagram Reels", "YouTube Shorts", "Talking-head editing", "Captions and subtitles", "Motion graphics", "Social media content packages"],
  },
  {
    slug: "podcast-production", n: "05", title: "Podcast Production",
    description: "Turn conversations into professional podcast experiences through quality production, editing and visual storytelling.",
    deliverables: ["Podcast filming", "Multi-camera editing", "Audio editing", "Podcast clips", "Promotional videos"],
  },
];

// Placeholders only. Replace with real projects (Phase 3 loads these from Supabase).
export const WORK_PLACEHOLDERS = [
  { category: "Product Shoot & Editing", span: "md:col-span-7", ratio: "aspect-[16/10]", offset: "" },
  { category: "Meta Ad Creatives", span: "md:col-span-5", ratio: "aspect-[4/5]", offset: "md:mt-24" },
  { category: "AI-Powered Video Production", span: "md:col-span-4", ratio: "aspect-[3/4]", offset: "" },
  { category: "Social Media Video Editing", span: "md:col-span-3", ratio: "aspect-[9/16]", offset: "md:mt-32" },
  { category: "Podcast Production", span: "md:col-span-5", ratio: "aspect-[4/3]", offset: "md:mt-12" },
];

export const PROBLEMS = [
  "Editing consumes valuable time.",
  "Content lacks professional quality.",
  "Maintaining consistency is difficult.",
  "Businesses struggle to find new ideas.",
  "Managing multiple creative resources becomes complicated.",
];

export const STAGES = [
  { n: "01", t: "Plan", d: "Creative ideas, content strategy and shoot planning." },
  { n: "02", t: "Shoot", d: "Professional cameras, lighting, audio and production." },
  { n: "03", t: "Edit", d: "Transform raw footage into polished visual content." },
  { n: "04", t: "Deliver", d: "Receive ready-to-publish content for your platforms." },
];

// Client names are shown as text until approved logos are supplied.
export const CLIENTS = ["Indian Institute of Interior Designers", "Star Agile", "EdgeX Learning", "Ira Holidays"];

export const PROCESS = [
  { n: "01", t: "Discover", d: "Understand the brand, target audience, requirements and objectives." },
  { n: "02", t: "Plan", d: "Develop concepts, creative directions and shoot plans." },
  { n: "03", t: "Shoot", d: "Capture professional footage and photographs." },
  { n: "04", t: "Edit", d: "Transform raw footage into polished visual content." },
  { n: "05", t: "Review", d: "Review deliverables and incorporate feedback." },
  { n: "06", t: "Deliver", d: "Provide final content in the required formats." },
];
