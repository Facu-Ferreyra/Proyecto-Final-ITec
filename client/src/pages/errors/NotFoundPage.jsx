// Página 404: cualquier ruta que no existe (App.jsx, path="*").
// Sigue las buenas prácticas de páginas de error: dice qué pasó sin culpar a
// nadie, ofrece salidas claras y no redirige sola a otra página.
// noindex: que los buscadores no guarden esta página como si fuera contenido.

import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'
import '../bots/theme.css'
import './not-found.css'

export default function NotFoundPage() {
  const { isAuthenticated } = useAuth()

  return (
    <main className="bots-area not-found" aria-labelledby="not-found-title">
      {/* React 19 lleva <title> y <meta> al <head> mientras la página está abierta. */}
      <title>Página no encontrada · EasyBot</title>
      <meta name="robots" content="noindex" />

      <div className="not-found-content">
        {/* El número es decorativo: el lector de pantalla lee directamente el título. */}
        <p className="not-found-code" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-title">Esta página no existe.</h1>
        <p className="not-found-text">Puede que el link esté mal escrito o que la página se haya movido.</p>
        <div className="not-found-actions">
          <Link className="btn btn-primary" to="/">
            Volver al inicio
          </Link>
          {isAuthenticated && (
            <Link className="btn btn-secondary" to="/bots">
              Ir a Mis bots
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
