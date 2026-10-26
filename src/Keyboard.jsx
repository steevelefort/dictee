import { useState } from 'react'
import { ACCENTS } from './accents.js'
import { usePress } from './usePress.js'

const ACCENT_PRESS_MS = 450
const CLEAR_PRESS_MS = 700
const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('')

function KeyLabel({ char }) {
  return (
    <>
      <span className="key-upper">{char.toUpperCase()}</span>
      <span className="key-lower">{char}</span>
    </>
  )
}

function BackspaceIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H8l-6-7z" fill="#fff" />
      <path
        d="M11 9l6 6m0-6l-6 6"
        stroke="#e8314a"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SpeakIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" fill="#fff" />
      <path d="M12 7v4.5" stroke="#22c04a" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="12" cy="13.6" r="1.2" fill="#22c04a" />
    </svg>
  )
}

function Key({ className = '', isPressed, onPress, children, ...props }) {
  return (
    <button
      type="button"
      className={`key ${className}${isPressed ? ' is-pressed' : ''}`}
      onTouchStart={onPress}
      onMouseDown={onPress}
      {...props}
    >
      {children}
    </button>
  )
}

function variantAt(x, y) {
  const el = document.elementFromPoint(x, y)
  const key = el && el.closest('[data-variant]')
  return key ? key.getAttribute('data-variant') : null
}

export default function Keyboard({ onKey, onBackspace, onClear, onSpeak, speaking }) {
  // popup : { variants, rect }, ouverte par un appui long sur une lettre accentuable.
  const [popup, setPopup] = useState(null)
  const [hovered, setHovered] = useState(null)
  // :active est peu fiable sur iOS : on suit nous-mêmes la touche enfoncée.
  const [pressed, setPressed] = useState(null)
  const press = usePress()

  const closePopup = () => {
    setPopup(null)
    setHovered(null)
  }

  const start = (e, id, options) => {
    const started = press(e, {
      ...options,
      onRelease: (result) => {
        setPressed(null)
        options.onRelease(result)
      },
    })
    if (started) setPressed(id)
  }

  // Appui court : la lettre. Appui long : popup des accents ; glisser le doigt
  // sur une variante puis relâcher la sélectionne, sinon la popup reste ouverte.
  const pressLetter = (e, letter) => {
    const variants = ACCENTS[letter]
    const rect = e.currentTarget.getBoundingClientRect()
    let variant = null
    start(e, letter, {
      longPressMs: variants ? ACCENT_PRESS_MS : 0,
      onLongPress: () => setPopup({ variants: [letter, ...variants], rect }),
      onMove: (x, y) => {
        variant = variantAt(x, y)
        setHovered(variant)
      },
      onRelease: ({ completed, long }) => {
        if (!completed) closePopup()
        else if (!long) onKey(letter)
        else if (variant) {
          onKey(variant)
          closePopup()
        }
      },
    })
  }

  const pressVariant = (e, variant) =>
    start(e, `variant-${variant}`, {
      onRelease: ({ completed }) => {
        if (!completed) return
        onKey(variant)
        closePopup()
      },
    })

  // Appui court : efface une lettre. Appui long : efface tout le texte.
  const pressBackspace = (e) =>
    start(e, 'backspace', {
      longPressMs: CLEAR_PRESS_MS,
      onLongPress: onClear,
      onRelease: ({ completed, long }) => {
        if (completed && !long) onBackspace()
      },
    })

  // Déclenché au relâchement : iOS n'autorise la synthèse vocale que
  // pendant un geste « complet » (touchend), pas sur touchstart.
  const pressAction = (id, action) => (e) =>
    start(e, id, {
      onRelease: ({ completed }) => {
        if (completed) action()
      },
    })

  return (
    <div className="keyboard">
      {LETTERS.map((letter) => (
        <Key
          key={letter}
          aria-label={letter}
          isPressed={pressed === letter}
          onPress={(e) => pressLetter(e, letter)}
        >
          <KeyLabel char={letter} />
        </Key>
      ))}
      <Key
        className="key-space"
        aria-label="espace"
        isPressed={pressed === 'space'}
        onPress={pressAction('space', () => onKey(' '))}
      />
      <Key
        className="key-backspace"
        aria-label="effacer"
        isPressed={pressed === 'backspace'}
        onPress={pressBackspace}
        style={{ '--clear-ms': `${CLEAR_PRESS_MS}ms` }}
      >
        <BackspaceIcon />
      </Key>
      <Key
        className="key-speak"
        aria-label="lire à voix haute"
        isPressed={pressed === 'speak' || speaking}
        onPress={pressAction('speak', onSpeak)}
      >
        <SpeakIcon />
      </Key>

      {popup && (
        <AccentPopup
          popup={popup}
          isHighlighted={(v) => hovered === v || pressed === `variant-${v}`}
          onPress={pressVariant}
          onDismiss={closePopup}
        />
      )}
    </div>
  )
}

function AccentPopup({ popup, isHighlighted, onPress, onDismiss }) {
  const { rect, variants } = popup
  const gap = rect.width * 0.08
  const width = variants.length * rect.width + (variants.length + 1) * gap
  const height = rect.height + gap * 2
  const margin = 8

  let left = rect.left + rect.width / 2 - width / 2
  left = Math.max(margin, Math.min(left, window.innerWidth - width - margin))
  let top = rect.top - height - gap
  if (top < margin) top = rect.bottom + gap

  return (
    <>
      <div className="popup-backdrop" onTouchStart={onDismiss} onMouseDown={onDismiss} />
      <div
        className="popup"
        style={{
          left,
          top,
          padding: gap,
          fontSize: Math.min(rect.height, rect.width) * 0.42,
        }}
      >
        {variants.map((v, i) => (
          <Key
            key={v}
            data-variant={v}
            className="popup-key"
            aria-label={v}
            isPressed={isHighlighted(v)}
            onPress={(e) => onPress(e, v)}
            // Pas de gap en flexbox sur Safari 12 : marge à la place.
            style={{ width: rect.width, height: rect.height, marginLeft: i ? gap : 0 }}
          >
            <KeyLabel char={v} />
          </Key>
        ))}
      </div>
    </>
  )
}
