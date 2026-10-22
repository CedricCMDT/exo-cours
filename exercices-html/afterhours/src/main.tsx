import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'
import { NetworkProvider } from './context/NetworkContext'
import './styles.css'

createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><NetworkProvider><App /></NetworkProvider></BrowserRouter></StrictMode>)

import './neo.css'
// Dernière couche CSS : salle de contrôle et commandes du fil.
import './control-room.css'
