// Página de inicio pública (landing) de EasyBot.
// No sabe de rutas: avisa con onLogin y onRegister, y quien la monta
// (el router de la app) decide a qué pantalla llevar.

import HomeHeader from '../../components/home/HomeHeader.jsx'
import HeroSection from '../../components/home/HeroSection.jsx'
import ProblemSection from '../../components/home/ProblemSection.jsx'
import StepsSection from '../../components/home/StepsSection.jsx'
import BenefitsSection from '../../components/home/BenefitsSection.jsx'
import TemplatesSection from '../../components/home/TemplatesSection.jsx'
import CtaFooter from '../../components/home/CtaFooter.jsx'
import './home.css'
import './home-sections.css'
import './home-layout.css'

export default function HomePage({ onLogin, onRegister }) {
  return (
    <div className="home">
      <HomeHeader onLogin={onLogin} onRegister={onRegister} />
      <main>
        <HeroSection onRegister={onRegister} />
        <ProblemSection />
        <StepsSection />
        <BenefitsSection />
        <TemplatesSection />
      </main>
      <CtaFooter onLogin={onLogin} onRegister={onRegister} />
    </div>
  )
}
