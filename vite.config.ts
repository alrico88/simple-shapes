import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';
import { VitePWA } from 'vite-plugin-pwa';
import ViteFonts from 'vite-plugin-fonts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Icons({
      compiler: 'vue3',
      defaultStyle: 'vertical-align: middle; transform: translateY(-5%);',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Simple Shapes',
        short_name: 'Simple Shapes',
        description: 'Web app where you can draw any geographical shape and get its representation in WKT or GeoJSON',
        theme_color: '#eaf4ff',
        background_color: '#eaf4ff',
      },
    }),
    ViteFonts({
      google: {
        families: [{
          name: 'Fira Sans',
          styles: 'wght@400;500;700',
        }],
      },
    }),
  ],
});
