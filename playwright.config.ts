import { defineConfig, devices } from '@playwright/test'

// Sin URL_APP prueba contra `vite preview` local; con URL_APP, contra el sitio publicado.
// Ej.: URL_APP=https://jacko111.github.io/cuentas-claras/ npx playwright test
const URL_APP = process.env.URL_APP

export default defineConfig({
  testDir: 'e2e',
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: URL_APP ?? 'http://localhost:4173/cuentas-claras/',
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
  },
  // Chrome completo: el headless shell no evalúa instalabilidad (devuelve [] siempre)
  projects: [{ name: 'android', use: { ...devices['Pixel 7'], channel: 'chrome' } }],
  webServer: URL_APP
    ? undefined
    : {
        command: 'npm run preview -- --port 4173 --strictPort',
        url: 'http://localhost:4173/cuentas-claras/',
        reuseExistingServer: !process.env.CI,
      },
})
