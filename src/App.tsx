const enPantallaCompleta = () =>
  window.matchMedia('(display-mode: standalone)').matches

export default function App() {
  return (
    <main className="portada">
      <img className="portada__logo" src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" width={96} height={96} />
      <h1 className="portada__titulo">Cuentas Claras</h1>
      <p className="portada__lema">Cuentas claras conservan la amistad… y el matrimonio.</p>
      <p className="portada__estado" data-testid="modo">
        {enPantallaCompleta() ? 'Instalada ✓' : 'Abierta en el navegador'}
      </p>
      <p className="portada__version">v{__APP_VERSION__}</p>
    </main>
  )
}
