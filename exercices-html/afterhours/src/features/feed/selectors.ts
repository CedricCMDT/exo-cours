import type { Post, Query } from '../../types'

/**
 * Sélecteurs purs du fil de discussion.
 *
 * Ces fonctions ne dépendent ni de React ni du réseau. Elles peuvent être
 * réutilisées dans plusieurs vues et testées avec de simples tableaux.
 */
export type FeedSource = 'api' | 'archive' | 'all'
export type FeedOrder = 'recent' | 'clash' | 'ignored' | 'popular'

export function controversy(post: Post): number {
  // Le score valorise la présence de réactions opposées, pas leur seul volume.
  return Math.min(post.reactions.likes, post.reactions.dislikes)
}

/**
 * Sélectionne une provenance. Les contributions locales restent visibles
 * quel que soit l'onglet choisi par l'utilisateur.
 */
export function selectSource(posts: Post[], source: FeedSource): Post[] {
  return posts.filter(
    (post) =>
      post.local ||
      source === 'all' ||
      (source === 'api' && post.source === 'api') ||
      (source === 'archive' && post.source === 'community'),
  )
}

/** Combine recherche, catégorie et seuil de popularité dans un seul passage. */
export function filterPosts(posts: Post[], query: Query): Post[] {
  const search = query.text.trim().toLocaleLowerCase('fr')
  return posts.filter((post) => {
    const matchesText = `${post.title} ${post.body}`.toLocaleLowerCase('fr').includes(search)
    const matchesTag = !query.tag || post.tags.includes(query.tag)
    const matchesPopularity =
      query.popularity === 'all' ||
      (query.popularity === 'popular'
        ? post.reactions.likes >= 100
        : post.reactions.likes < 100)

    return matchesText && matchesTag && matchesPopularity
  })
}

export function orderPosts(posts: Post[], order: FeedOrder): Post[] {
  // sort() étant mutatif, la copie préserve les données partagées du contexte.
  return [...posts].sort((left, right) => {
    if (order === 'clash') return controversy(right) - controversy(left)
    if (order === 'popular')
      return right.reactions.likes + right.reactions.dislikes -
        left.reactions.likes - left.reactions.dislikes
    if (order === 'ignored') return left.views - right.views
    return (right.createdAt ?? '').localeCompare(left.createdAt ?? '')
  })
}

export function feedCategories(posts: Post[]) {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts]
    .map(([slug, count]) => ({ slug, label: slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 24)
}

/** Fournit au moins une page, même lorsque la recherche ne renvoie aucun post. */
export function pageCount(total: number, size: number) {
  return Math.max(1, Math.ceil(total / size))
}
