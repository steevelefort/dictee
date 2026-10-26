import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Cible : iPad mini 2 et ultérieurs, soit iOS 12.5 / Safari 12 au minimum.
// Vite 8 vise Safari 16.4 par défaut : le JS (?., ??…) planterait sur iOS 12.
const SAFARI_TARGET = 'safari12'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: SAFARI_TARGET,
    cssTarget: SAFARI_TARGET,
  },
})
