import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Cible : iPad mini 2 et ultérieurs, soit iOS 12.5 / Safari 12 au minimum.
// Vite 8 vise Safari 16.4 par défaut : le JS (?., ??…) planterait sur iOS 12.
const SAFARI_TARGET = 'safari12'

// https://vite.dev/config/
export default defineConfig({
  // Publiée sur GitHub Pages : https://steevelefort.github.io/dictee/
  base: '/dictee/',
  plugins: [
    react(),
    VitePWA({
      // Mise à jour silencieuse : la nouvelle version s'installe au prochain lancement.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon*.png'],
      manifest: {
        name: 'Dictée',
        short_name: 'Dictée',
        description: 'Clavier alphabétique qui lit à voix haute les mots tapés.',
        lang: 'fr',
        display: 'standalone',
        orientation: 'any',
        theme_color: '#000000',
        background_color: '#000000',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Tout est mis en cache : l'app fonctionne entièrement hors ligne.
        // woff2 suffit : Safari 12 le prend en charge, le .woff n'est jamais téléchargé.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,woff2}'],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  build: {
    target: SAFARI_TARGET,
    cssTarget: SAFARI_TARGET,
  },
})
