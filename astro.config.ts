import partytown from "@astrojs/partytown";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), partytown()],
  adapter:
    // node({ mode: "standalone" }) ||
    vercel({
      webAnalytics: { enabled: true },
    }),
  output: "hybrid",
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
    ssr: {
      noExternal: ["path-to-regexp"],
    },
  },
});
