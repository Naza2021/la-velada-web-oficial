import tailwind from "@astrojs/tailwind";

import worker from "@nazfy/worker";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), worker()],
  // adapter: node({ mode: "standalone" }),
  // vercel({
  //   webAnalytics: { enabled: true },
  // }),
  vite: {
    build: {
      cssMinify: "lightningcss",
    },
    ssr: {
      noExternal: ["path-to-regexp"],
    },
  },
});
