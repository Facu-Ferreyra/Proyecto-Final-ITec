// Selector de hora compacto (reemplaza al <select> nativo, que con 48 horarios
// desplegaba una lista que tapaba casi toda la pantalla).
//
// Patrón "select-only combobox" de ARIA: un botón que abre una lista corta con
// scroll propio. Al abrir se ubica en la hora elegida (o en DEFAULT_TIME).
// Teclado: ↑ ↓ Inicio Fin RePág AvPág para moverse, Enter/Espacio para elegir,
// Esc para cerrar, y escribir números salta a esa hora ("18" → 6:00 PM).

import { useEffect, useId, useRef, useState } from 'react'

const DEFAULT_TIME = '09:00'
const PAGE = 5 // opciones que salta RePág / AvPág
const LIST_HEIGHT = 248 // igual que max-height en presets.css

export default function TimeSelect({ label, value, options, onChange, format = (option) => option }) {
  const id = useId()
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const typed = useRef({ text: '', timer: null })
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [openUp, setOpenUp] = useState(false)

  // "" = sin elegir, después las horas.
  const items = ['', ...options]
  const optionId = (index) => `${id}-opt-${index}`

  function open() {
    const selected = items.indexOf(value)
    setActive(selected > 0 ? selected : Math.max(items.indexOf(DEFAULT_TIME), 0))
    // Si abajo no entra la lista, se abre hacia arriba.
    const rect = buttonRef.current.getBoundingClientRect()
    setOpenUp(window.innerHeight - rect.bottom < LIST_HEIGHT + 16 && rect.top > LIST_HEIGHT + 16)
    setIsOpen(true)
  }

  function close({ focusButton = true } = {}) {
    setIsOpen(false)
    if (focusButton) buttonRef.current?.focus()
  }

  function choose(index) {
    onChange(items[index])
    close()
  }

  // Al abrir: foco en la lista. Al moverse: la opción activa queda a la vista
  // (al abrir, centrada).
  const justOpened = useRef(false)
  useEffect(() => {
    if (isOpen) {
      justOpened.current = true
      listRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const option = document.getElementById(optionId(active))
    const list = listRef.current
    if (!option || !list) return
    if (justOpened.current) {
      list.scrollTop = option.offsetTop - list.clientHeight / 2 + option.clientHeight / 2
      justOpened.current = false
    } else {
      option.scrollIntoView({ block: 'nearest' })
    }
    // optionId depende solo de id, que no cambia.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, active])

  // Click o toque fuera del selector: se cierra sin elegir.
  useEffect(() => {
    if (!isOpen) return
    function onPointerDown(event) {
      if (!buttonRef.current?.parentElement.contains(event.target)) close({ focusButton: false })
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [isOpen])

  // Escribir números salta a la primera hora que empiece así ("9" → 09:00, "18" → 18:00).
  function typeAhead(char) {
    const state = typed.current
    clearTimeout(state.timer)
    state.text += char
    state.timer = setTimeout(() => (state.text = ''), 700)
    const target = state.text.padStart(2, '0').slice(0, 2)
    const index = items.findIndex((item) => item.startsWith(target))
    if (index > 0) setActive(index)
  }

  function handleListKeyDown(event) {
    const last = items.length - 1
    const moves = {
      ArrowDown: Math.min(active + 1, last),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: last,
      PageDown: Math.min(active + PAGE, last),
      PageUp: Math.max(active - PAGE, 0),
    }
    if (event.key in moves) {
      event.preventDefault()
      setActive(moves[event.key])
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(active)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation() // que no cierre también un diálogo de afuera
      close()
    } else if (event.key === 'Tab') {
      close({ focusButton: false })
    } else if (/^\d$/.test(event.key)) {
      typeAhead(event.key)
    }
  }

  function handleButtonKeyDown(event) {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      open()
    }
  }

  return (
    <div className="time-select">
      <button
        ref={buttonRef}
        type="button"
        className="time-select-button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-list`}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleButtonKeyDown}
      >
        <span className={value ? '' : 'time-select-placeholder'}>{value ? format(value) : '—'}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          className={openUp ? 'time-select-list time-select-list-up' : 'time-select-list'}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          aria-activedescendant={optionId(active)}
          onKeyDown={handleListKeyDown}
        >
          {items.map((item, index) => (
            <li
              key={item || 'empty'}
              id={optionId(index)}
              role="option"
              aria-selected={item === value}
              className={[
                'time-select-option',
                index === active && 'time-select-option-active',
                !item && 'time-select-placeholder',
              ]
                .filter(Boolean)
                .join(' ')}
              onPointerMove={() => setActive(index)}
              onClick={() => choose(index)}
            >
              {item ? format(item) : 'Sin elegir'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
