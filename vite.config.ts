import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import { VitePWA } from 'vite-plugin-pwa';
import ViteFonts from 'vite-plugin-fonts';
import Components from 'unplugin-vue-components/vite'
import {BootstrapVueNextResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: [],
      resolvers: [
        BootstrapVueNextResolver()
      ]
    }),
    Icons({
      compiler: 'vue3',
      defaultStyle: 'vertical-align: middle; transform: translateY(-5%);',
    }),
    ViteFonts({
      google: {
        families: [{
          name: 'Fira Sans',
          styles: 'wght@400;500;700',
        }],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Simple Shapes',
        short_name: 'Simple Shapes',
        description: 'Web app where you can draw any geographical shape and get its representation in WKT or GeoJSON',
        theme_color: '#eaf4ff',
        background_color: '#eaf4ff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
