// Chat de ejemplo de la portada, que "se conversa solo" una vez al cargar:
// escribiendo… → saludo → opciones → el cliente toca "Horarios" → respuesta.
// Muestra el producto funcionando en 4 segundos, sin que nadie tenga que leer.
//
// Todos los mensajes están en la página desde el principio (invisibles hasta su
// turno): el chat ocupa su tamaño final y la portada no "salta" mientras se arma.
// Con "reducir movimiento" se muestra la conversación completa, sin animar.

import { useEffect, useRef, useState } from 'react'
import BotAvatar from '../common/BotAvatar.jsx'

const OPTIONS = ['Horarios', 'Precios', 'Ubicación', 'Sacar un turno']
const CHOSEN = 'Horarios'

// Etapas de la conversación y cuándo empieza cada una (ms desde que arranca).
const TYPING_1 = 1
const GREETING = 2
const CHIPS = 3
const PRESSED = 4
const USER_MSG = 5
const TYPING_2 = 6
const ANSWER = 7
const TIMELINE = [
  [300, TYPING_1],
  [1100, GREETING],
  [1450, CHIPS],
  [2450, PRESSED],
  [2700, USER_MSG],
  [3050, TYPING_2],
  [3950, ANSWER],
]

// Lo que tarda la entrada de la portada (cartel colgado + título escrito).
const HERO_SETTLE_MS = 1000

const prefersReducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

function Typing() {
  return (
    <span className="home-typing" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

export default function ExampleChat() {
  const [stage, setStage] = useState(() => (prefersReducedMotion() ? ANSWER : 0))
  const [run, setRun] = useState(0) // cambia con "Ver de nuevo"
  const figureRef = useRef(null)

  // Arranca cuando el chat entra en pantalla (en la portada, enseguida).
  useEffect(() => {
    if (prefersReducedMotion()) return
    const timers = []
    // La primera vez espera a que el cartel de la portada termine de asentarse
    // (≈1,3 s): así no compiten dos animaciones a la vez. "Ver de nuevo" arranca ya.
    const delay = run === 0 ? HERO_SETTLE_MS : 0
    const start = () =>
      TIMELINE.forEach(([ms, next]) => timers.push(setTimeout(() => setStage(next), ms + delay)))
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect()
          start()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(figureRef.current)
    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [run])

  function replay() {
    setStage(0)
    setRun((n) => n + 1)
  }

  const shown = (from) => (stage >= from ? 'true' : 'false')

  return (
    <figure ref={figureRef} className="home-chat" aria-label="Ejemplo de conversación con el bot de Peluquería Lola">
      <span className="home-stamp home-chat-stamp">Chat de ejemplo</span>
      <div className="home-chat-header">
        <BotAvatar name="Peluquería Lola" size={36} />
        <div className="home-chat-header-text">
          <strong>Peluquería Lola</strong>
          <span>Respuestas automáticas</span>
        </div>
        {stage === ANSWER && !prefersReducedMotion() && (
          <button type="button" className="home-chat-replay" onClick={replay}>
            Ver de nuevo
          </button>
        )}
      </div>

      <div className="home-chat-body">
        <div className="home-chat-slot">
          <p className="home-chat-bubble home-reveal" data-shown={shown(GREETING)}>
            ¡Hola! Soy el asistente de Peluquería Lola. ¿En qué te puedo ayudar?
          </p>
          {stage === TYPING_1 && <Typing />}
        </div>

        <ul className="home-chip-list home-reveal" data-shown={shown(CHIPS)} aria-label="Opciones del bot">
          {OPTIONS.map((option) => (
            <li key={option} className="home-chip" data-pressed={option === CHOSEN && stage >= PRESSED}>
              {option}
            </li>
          ))}
        </ul>

        <p className="home-chat-bubble home-chat-bubble-user home-reveal" data-shown={shown(USER_MSG)}>
          {CHOSEN}
        </p>

        <div className="home-chat-slot">
          {/* La respuesta cae como un cartel de la vidriera: colgado, con el dato grande. */}
          <div className="home-chat-sign eb-sign eb-sign--sand eb-tape eb-hang home-reveal" data-shown={shown(ANSWER)}>
            <p className="home-chat-sign-lead">Atendemos de martes a sábado</p>
            <p className="home-chat-sign-fact eb-marker">
              <span>De 9:00 AM</span> <span>a 7:00 PM</span>
            </p>
          </div>
          {stage === TYPING_2 && <Typing />}
        </div>
      </div>
    </figure>
  )
}
