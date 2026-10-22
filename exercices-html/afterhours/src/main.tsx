import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'
import { NetworkProvider } from './context/NetworkContext'

// Les fichiers CSS se complètent dans cet ordre, du général au spécifique.
import './styles.css'
// Refonte futuriste : plus aucun CSS rétro chargé.
import './future.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NetworkProvider>
        <App />
      </NetworkProvider>
    </BrowserRouter>
  </StrictMode>,
)
