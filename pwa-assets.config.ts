import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Genera los PNG de la PWA a partir del logo: `npm run iconos`
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#1F3A5F' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#1F3A5F' } },
  },
  images: ['public/favicon.svg'],
})
