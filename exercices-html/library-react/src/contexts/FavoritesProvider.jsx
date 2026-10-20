import { useEffect, useState } from 'react'
import { FavoritesContext } from './FavoritesContext.js'

function readFavorites() {
  try {
    const data = JSON.parse(localStorage.getItem('library-favorites') || '[]')
    return Array.isArray(data) ? [...new Set(data.filter(id => typeof id === 'string'))] : []
  } catch {
    return []
  }
}

export default function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readFavorites)

  useEffect(() => {
    try {
      localStorage.setItem('library-favorites', JSON.stringify(favorites))
    } catch { /* Stockage indisponible : favoris conservés en mémoire */ }
  }, [favorites])

  function toggleFavorite(id) {
    setFavorites(previous => previous.includes(id)
      ? previous.filter(item => item !== id)
      : [...previous, id])
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
