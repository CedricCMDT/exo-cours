import { useEffect, useState } from 'react'
import { getBook } from '../api/books.js'

export default function useBook(id) {
  const [book, setBook] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignored = false

    async function load() {
      setBook(null)
      setError('')
      setLoading(true)
      try {
        const result = await getBook(id)
        if (!ignored) setBook(result)
      } catch (e) {
        if (!ignored) setError(e.status === 404 ? 'Livre introuvable.' : (e.message || 'Impossible de charger ce livre.'))
      } finally {
        if (!ignored) setLoading(false)
      }
    }
    load()
    return () => { ignored = true }
  }, [id])

  return { book, loading, error }
}
