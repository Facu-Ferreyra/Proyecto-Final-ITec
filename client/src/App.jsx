// Rutas de la app (Brandon).
//
//   Públicas ............ /  /login  /register  /chat/:slug
//   Con sesión .......... /bots  /bots/new  /bots/:id/edit  /panel
//   Con sesión + ADMIN .. /admin
//
// ProtectedRoute y RoleRoute solo mejoran la experiencia (no mostrar pantallas
// que no corresponden). La seguridad real está en el backend: requireAuth (401),
// requireRole (403) y el filtro por dueño en cada consulta (404).

import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import RoleRoute from './components/common/RoleRoute.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import PlaceholderPage from './components/layout/PlaceholderPage.jsx'
import AdminPage from './pages/admin/AdminPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import BotWizardPage from './pages/bots/BotWizardPage.jsx'
import MyBotsPage from './pages/bots/MyBotsPage.jsx'
import HomePage from './pages/home/HomePage.jsx'
import PanelPage from './pages/panel/PanelPage.jsx'
import PublicChatPage from './pages/public/PublicChatPage.jsx'

// Las pantallas de Ayelen no conocen las rutas: avisan con callbacks (onCreate,
// onEdit, onExit) y acá se traducen a navegación.

function HomeRoute() {
  const navigate = useNavigate()
  return <HomePage onLogin={() => navigate('/login')} onRegister={() => navigate('/register')} />
}

function MyBotsRoute() {
  const navigate = useNavigate()
  return <MyBotsPage onCreate={() => navigate('/bots/new')} onEdit={(bot) => navigate(`/bots/${bot.id}/edit`)} />
}

function BotWizardRoute() {
  const { id } = useParams()
  const navigate = useNavigate()
  // key: si se pasa de editar un bot a otro, el asistente arranca de cero.
  return <BotWizardPage key={id ?? 'new'} botId={id} onExit={() => navigate('/bots')} />
}

function PanelRoute() {
  const navigate = useNavigate()
  return <PanelPage onCreateBot={() => navigate('/bots/new')} />
}

function PublicChatRoute() {
  const { slug } = useParams()
  // key: si cambia el slug, el chat arranca de cero (otra conversación).
  return <PublicChatPage key={slug} slug={slug} />
}

export default function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/chat/:slug" element={<PublicChatRoute />} />

      {/* Requieren sesión */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/bots" element={<MyBotsRoute />} />
          <Route path="/bots/new" element={<BotWizardRoute />} />
          <Route path="/bots/:id/edit" element={<BotWizardRoute />} />
          <Route path="/panel" element={<PanelRoute />} />

          {/* Requieren sesión + rol ADMIN */}
          <Route element={<RoleRoute roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<PlaceholderPage title="Página no encontrada" text="El link que seguiste no existe o cambió." />} />
    </Routes>
  )
}
