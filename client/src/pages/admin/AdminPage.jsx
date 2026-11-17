// Administración (solo rol ADMIN): plantillas y usuarios.
// RoleRoute ya evita que un usuario común vea esta pantalla, pero la seguridad
// real está en el backend: cada pedido de /api/admin responde 403 si no es admin.

import { useState } from 'react'
import '../../components/common/common.css'
import Tabs from '../../components/common/Tabs.jsx'
import { useAuth } from '../../context/useAuth.js'
import '../bots/theme.css'
import './admin.css'
import TemplatesAdmin from './TemplatesAdmin.jsx'
import UsersAdmin from './UsersAdmin.jsx'

const TABS = [
  { id: 'templates', label: 'Plantillas' },
  { id: 'users', label: 'Usuarios' },
]

export default function AdminPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('templates')

  return (
    <main className="bots-area">
      <header className="page-header">
        <h1>Administración</h1>
      </header>
      <Tabs tabs={TABS} active={tab} onChange={setTab} label="Secciones de administración" />
      {tab === 'templates' ? <TemplatesAdmin /> : <UsersAdmin currentUserId={user?.id} />}
    </main>
  )
}
