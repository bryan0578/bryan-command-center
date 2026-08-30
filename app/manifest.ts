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
      {
        src: "/icons/portfolio-icon.svg?v=portfolio-2",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icons/portfolio-icon-maskable.svg?v=portfolio-2",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
