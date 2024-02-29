import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import worker from "@astropub/worker";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), worker()],
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
