/**
 * Contrats partagés par les pages, les composants et les services.
 *
 * Les propriétés optionnelles évitent d'inventer des dates / images
 * quand une source externe ne les fournit pas.
 */

/** Provenance d'une publication affichée sur Afterhours. */
export type PostSource = 'api' | 'community' | 'session'

export type Post = {
  id: number
  userId: number
  title: string
  body: string
  tags: string[]
  reactions: {
    likes: number
    dislikes: number
  }
  views: number
  createdAt?: string
  source?: PostSource
  local?: boolean
}

export type Member = {
  id: number
  username: string
  firstName: string
  lastName: string
  image?: string
  bio?: string
  joinedAt?: string
}

/** Critères d'affichage du fil, indépendants des requêtes HTTP. */
export type Query = {
  text: string
  tag: string
  popularity: string
  page: number
}

/** Le serveur récupère l'auteur via le cookie, pas via ce formulaire. */
export type Creation = {
  title: string
  body: string
  tags: string[]
}
