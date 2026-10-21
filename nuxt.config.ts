import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-10-01",
  devtools: { enabled: false },
  telemetry: false,
  modules: ["@nuxt/icon"],

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  features: {
    inlineStyles: false,
  },

  app: {
    head: {
      htmlAttrs: { lang: "ru" },
      title: "ink",
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        {
          name: "description",
          content: "анонимные публикации без регистрации.",
        },
        { name: "referrer", content: "no-referrer" },
        { name: "robots", content: "noindex, nofollow, noarchive" },
        { name: "color-scheme", content: "dark" },
        { name: "theme-color", content: "#111110" },
      ],
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },

  runtimeConfig: {
    databasePath: "./data/ink.db",
    trustProxy: false,
    powDifficulty: 16,
    rateLimit: {
      windowSeconds: 600,
      createPerClient: 10,
      createGlobal: 600,
    },
    public: {
      siteUrl: "",
    },
  },

  nitro: {
    preset: "node-server",
  },

  typescript: {
    strict: true,
  },
});
