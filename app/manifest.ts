import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Bryan Command Center",
    short_name: "Command Center",
    description: "A private daily operating system for focus, execution, and review.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#070a0d",
    theme_color: "#070a0d",
    categories: ["productivity"],
    icons: [
      { src: "/icons/icon-192.png?v=portfolio-1", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png?v=portfolio-1", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png?v=portfolio-1", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
