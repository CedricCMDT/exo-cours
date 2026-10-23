import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Query } from '../types'

type FeedQueryValue = {
  query: Query
  setCriteria: (changes: Partial<Omit<Query, 'page'>>) => void
  setPage: (page: number) => void
}

const FeedQueryContext = createContext<FeedQueryValue | null>(null)

/** Les filtres et la pagination du fil sont indépendants de l'API REST. */
export function FeedQueryProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState<Query>({
    text: '',
    tag: '',
    popularity: 'all',
    page: 1,
  })

  // Modifier un filtre ramène l'utilisateur à la première page de résultats.
  const setCriteria = useCallback((changes: Partial<Omit<Query, 'page'>>) => {
    setQuery((current) => ({ ...current, ...changes, page: 1 }))
  }, [])
  const setPage = useCallback((page: number) => {
    setQuery((current) => ({ ...current, page }))
  }, [])

  const value = useMemo(() => ({ query, setCriteria, setPage }), [query, setCriteria, setPage])
  return <FeedQueryContext.Provider value={value}>{children}</FeedQueryContext.Provider>
}

export function useFeedQuery() {
  const value = useContext(FeedQueryContext)
  if (!value) throw new Error('FeedQueryProvider manquant')
  return value
}
