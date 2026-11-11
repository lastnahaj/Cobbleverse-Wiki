import type { APIRoute } from "astro";
import { withBase } from "../lib/basePath";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: "Cobbleverse Wiki",
      short_name: "Cobbleverse",
      description: "Official field guide for the Cobbleverse server.",
      start_url: withBase("/"),
      scope: withBase("/"),
      display: "standalone",
      background_color: "#070b10",
      theme_color: "#0b171d",
      icons: [
        {
          src: withBase("/assets/brand/favicon-192x192.png"),
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: withBase("/assets/brand/favicon-512x512.png"),
          sizes: "512x512",
          type: "image/png",
        },
      ],
    }),
    { headers: { "Content-Type": "application/manifest+json" } },
  );
