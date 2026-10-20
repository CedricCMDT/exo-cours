import fallbackCover from '../assets/moby-dick.png'

const API = 'https://www.googleapis.com/books/v1/volumes'
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

function checkKey() {
  if (!API_KEY) throw new Error('Clé API manquante : ajoute VITE_GOOGLE_BOOKS_API_KEY dans .env.local')
}

async function getJson(url) {
  let lastError
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        let description = ''
        try {
          const data = await response.json()
          description = data.error?.message || ''
        } catch { /* Réponse non JSON */ }
        const error = new Error(description || 'Erreur HTTP ' + response.status)
        error.status = response.status
        throw error
      }
      return await response.json()
    } catch (error) {
      lastError = error
      if (attempt === 2 || ![429, 500, 502, 503, 504].includes(error.status)) break
      await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 1000))
    }
  }
  throw lastError
}

export function normalizeBook(book) {
  const info = book.volumeInfo || {}
  return {
    id: book.id,
    title: info.title || 'Sans titre',
    authors: info.authors?.length ? info.authors : ['Auteur inconnu'],
    publishedDate: info.publishedDate || 'Date inconnue',
    cover: info.imageLinks?.thumbnail?.replace(/^http:/, 'https:') ||
      info.imageLinks?.smallThumbnail?.replace(/^http:/, 'https:') || fallbackCover,
    language: info.language || 'Non précisée',
    description: info.description || 'Aucun résumé disponible pour ce livre.',
    categories: info.categories || [],
  }
}

export async function searchBooks(query) {
  checkKey()
  const params = new URLSearchParams({ q: query, key: API_KEY, maxResults: '12' })
  const data = await getJson(API + '?' + params.toString())
  return (data.items || []).map(normalizeBook)
}

export async function getBook(id) {
  checkKey()
  const params = new URLSearchParams({ key: API_KEY })
  const data = await getJson(API + '/' + encodeURIComponent(id) + '?' + params.toString())
  return normalizeBook(data)
}
