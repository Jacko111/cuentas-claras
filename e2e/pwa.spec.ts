import { expect, test } from '@playwright/test'

test('la app es instalable según Chrome', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Cuentas Claras' })).toBeVisible()

  // Esperar a que el service worker esté activo antes de preguntar
  await page.evaluate(() => navigator.serviceWorker.ready)

  const cdp = await page.context().newCDPSession(page)
  const { installabilityErrors } = await cdp.send('Page.getInstallabilityErrors')
  // Playwright abre contextos tipo incógnito: ese error es del entorno, no de la app
  const errores = installabilityErrors.map((e) => e.errorId).filter((id) => id !== 'in-incognito')
  expect(errores).toEqual([])

  const { url, data } = await cdp.send('Page.getAppManifest')
  expect(url).toMatch(/manifest\.webmanifest$/)
  const manifest = JSON.parse(data ?? '{}')
  expect(manifest.display).toBe('standalone')
})

test('fuera de la app instalada muestra que está en el navegador', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByTestId('modo')).toHaveText('Abierta en el navegador')
})
