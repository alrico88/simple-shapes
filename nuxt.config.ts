export default defineNuxtConfig({
  ssr: false,
  extends: ["nuxt-umami"],
  app: {
    head: {
      title: "Simple Shapes",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#eaf4ff" },
        {
          name: "description",
          content:
            "Web app where you can draw any geographical shape and get its representation in WKT or GeoJSON",
        },
        {
          name: "keywords",
          content:
            "geojson,wkt,draw,leaflet,bbox,kml,area,draw wkt,draw geojson",
        },
        {
          name: "author",
          content: "Alberto Rico",
        },
        {
          name: "google-site-verification",
          content: "nc0pKffQdhm679g_eXEQhjK-NzBM8ZbyFQLR9ZMeJtc",
        },
      ],
      htmlAttrs: {
        "data-bs-theme": "light",
      },
      link: [
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css",
        },
      ],
    },
  },
  css: [
    "@/assets/main.scss",
    "vue-prism-editor/dist/prismeditor.min.css",
    "prismjs/themes/prism-coy.css",
  ],
  modules: [
    "nuxt-icon",
    "@vueuse/nuxt",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "storeToRefs"],
      },
    ],
    "@vite-pwa/nuxt",
    "@nuxtjs/google-fonts",
    "@bootstrap-vue-next/nuxt",
  ],
  pwa: {
    registerType: "prompt",
    manifest: {
      name: "Simple Shapes",
      description:
        "Web app where you can draw any geographical shape and get its representation in WKT or GeoJSON",
      theme_color: "#eaf4ff",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico,woff,woff2}"],
      cleanupOutdatedCaches: true,
    },
  },
  googleFonts: {
    families: {
      "Fira+Sans": [400, 500, 700],
    },
  },
});
