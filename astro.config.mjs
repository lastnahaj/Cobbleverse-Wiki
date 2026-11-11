import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://wiki.infinitegamingservers.com",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
});
