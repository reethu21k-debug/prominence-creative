import type { NextConfig } from "next";

// Restrict Cloudinary to our own account's path when the cloud name is known at build time.
const cloud = process.env.CLOUDINARY_CLOUD_NAME;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: cloud ? `/${cloud}/**` : "/**" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
