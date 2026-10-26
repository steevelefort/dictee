import { useEffect, useRef, useState } from 'react'
import Keyboard from './Keyboard.jsx'
import { speak } from './speech.js'
import './App.css'

function App() {
  const [text, setText] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const barRef = useRef(null)

  // Sur iOS 12, user-scalable=no et touch-action sont ignorés : on bloque
  // zoom, défilement et menu contextuel en annulant les gestes tactiles.
  // L'écouteur doit être non passif, sinon preventDefault() est ignoré.
  useEffect(() => {
    const block = (e) => e.preventDefault()
    const options = { passive: false }
    const events = ['touchstart', 'touchmove', 'gesturestart']
    events.forEach((type) => document.addEventListener(type, block, options))
    return () =>
      events.forEach((type) => document.removeEventListener(type, block, options))
  }, [])

  // Garde la fin du texte visible quand il dépasse la largeur de la barre.
  useEffect(() => {
    const bar = barRef.current
    bar.scrollLeft = bar.scrollWidth
  }, [text])

  // Chaque lettre tapée est ajoutée au texte et prononcée seule.
  // La première lettre du texte est mise en majuscule.
  const handleKey = (char) => {
    setText((t) => t + (t.trim() === '' ? char.toUpperCase() : char))
    speak(char)
  }

  const handleSpeak = () =>
    speak(text, {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
    })

  return (
    <main className="app" onContextMenu={(e) => e.preventDefault()}>
      <div className="text-bar" ref={barRef}>
        <span className="text">{text}</span>
        <span className="caret" />
      </div>
      <Keyboard
        onKey={handleKey}
        onBackspace={() => setText((t) => t.slice(0, -1))}
        onClear={() => setText('')}
        onSpeak={handleSpeak}
        speaking={speaking}
      />
    </main>
  )
}

export default App
