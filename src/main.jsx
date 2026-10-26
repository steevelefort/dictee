import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Police embarquée (SIL OFL) : même rendu partout, y compris hors ligne.
import '@fontsource/andika/latin-400.css'
import '@fontsource/andika/latin-700.css'
import './viewport.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
