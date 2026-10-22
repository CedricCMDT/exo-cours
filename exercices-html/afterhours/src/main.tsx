import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'
import { NetworkProvider } from './context/NetworkContext'

// Styles rangés par rôle : les fichiers tardifs complètent les précédents.
// Les anciens thèmes rétro ne sont plus importés.
import './styles/foundation.css'
import './styles/dashboard.css'
import './styles/feed.css'
import './styles/pages.css'
import './styles/overlays.css'
import './styles/theme.css'
import './styles/responsive.css'
import './styles/effects.css'
import './styles/api.css'
// Toujours en dernier : composants partagés et adaptations clair/sombre.
import './styles/ui.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NetworkProvider>
        <App />
      </NetworkProvider>
    </BrowserRouter>
  </StrictMode>,
)
