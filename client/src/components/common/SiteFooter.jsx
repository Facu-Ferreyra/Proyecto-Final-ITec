// Pie de página común (el mismo de la home): marca, proyecto y política de privacidad.
// Lo usan las páginas de error (404, 403) y las de login/registro (donde aparece el aviso 401).

import { Link } from 'react-router-dom'
import './site-footer.css'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span className="site-footer-brand">
          <img src="/favicon.svg" alt="" width="22" height="22" />
          EasyBot
        </span>
        <p>Proyecto Integrador Final · Programación Web con IA aplicada · IntegrarTEC 2026</p>
        <Link to="/privacidad" className="site-footer-link">
          Política de privacidad
        </Link>
      </div>
    </footer>
  )
}
