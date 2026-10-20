import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Book from './pages/Book/Book.jsx'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App showHeader={false}>
      <Book />
    </App>
  </StrictMode>,
)
