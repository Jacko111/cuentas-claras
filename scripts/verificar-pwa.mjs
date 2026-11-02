// Verifica sobre dist/ los criterios de instalabilidad de Chrome para Android.
// (Lighthouse ya no audita PWA desde la v12, así que lo chequeamos a mano.)
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const errores = []
const chequear = (ok, mensaje) => {
  console.log(`${ok ? '✔' : '✘'} ${mensaje}`)
  if (!ok) errores.push(mensaje)
}

const html = readFileSync(join(DIST, 'index.html'), 'utf8')
const manifestHref = html.match(/<link[^>]+rel="manifest"[^>]+href="([^"]+)"/)?.[1]
chequear(Boolean(manifestHref), 'index.html enlaza el manifest')
chequear(/<meta name="theme-color"/.test(html), 'index.html define theme-color')
chequear(/viewport-fit=cover/.test(html), 'viewport con viewport-fit=cover')

const manifest = JSON.parse(readFileSync(join(DIST, 'manifest.webmanifest'), 'utf8'))
chequear(Boolean(manifest.name && manifest.short_name), 'manifest tiene name y short_name')
chequear(['standalone', 'fullscreen'].includes(manifest.display), `display = ${manifest.display}`)
chequear(manifest.start_url?.startsWith(manifest.scope), 'start_url dentro de scope')

const icono = (tamanio, purpose) =>
  manifest.icons?.find((i) => i.sizes === tamanio && (purpose ? i.purpose?.includes(purpose) : !i.purpose))
for (const [tamanio, purpose] of [['192x192'], ['512x512'], ['512x512', 'maskable']]) {
  const i = icono(tamanio, purpose)
  chequear(Boolean(i) && existsSync(join(DIST, i.src)), `ícono ${tamanio}${purpose ? ` ${purpose}` : ''} declarado y presente`)
}

chequear(existsSync(join(DIST, 'sw.js')), 'service worker sw.js generado')
const bundles = readdirSync(join(DIST, 'assets')).filter((f) => f.endsWith('.js'))
const registraSW = bundles.some((f) => /serviceWorker[\s\S]*sw\.js|sw\.js[\s\S]*serviceWorker/.test(readFileSync(join(DIST, 'assets', f), 'utf8')))
chequear(registraSW, 'la app registra el service worker')

if (errores.length) {
  console.error(`\n${errores.length} chequeo(s) fallaron`)
  process.exit(1)
}
console.log('\nPWA instalable ✔')
