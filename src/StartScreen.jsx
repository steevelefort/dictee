import { useState } from 'react'
import { speak } from './speech.js'
import { usePress } from './usePress.js'

const ICON = `${import.meta.env.BASE_URL}pwa-192x192.png`

// Écran d'accueil affiché à chaque démarrage. Le bouton « Commencer » fait
// une première synthèse vocale pendant un geste de l'utilisateur : sur iOS,
// le moteur répond souvent mal à sa toute première sollicitation.
export default function StartScreen({ onStart }) {
  const [pressed, setPressed] = useState(false)
  const press = usePress()

  const handlePress = (e) => {
    const started = press(e, {
      onRelease: ({ completed }) => {
        setPressed(false)
        if (!completed) return
        speak('Bonjour !')
        onStart()
      },
    })
    if (started) setPressed(true)
  }

  return (
    <div className="start-screen">
      <div className="start-card">
        <img className="start-icon" src={ICON} alt="" />
        <h1 className="start-title">La machine à lire</h1>
        <button
          type="button"
          className={`key key-speak start-button${pressed ? ' is-pressed' : ''}`}
          onTouchStart={handlePress}
          onMouseDown={handlePress}
        >
          Commencer
        </button>
      </div>
    </div>
  )
}
