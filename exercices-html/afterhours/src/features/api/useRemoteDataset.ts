import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchApiDataset } from '../../services/api'
import type { ApiDataset } from '../../services/api'

/** États exposés à l'interface pour le chargement du catalogue externe. */
export type ApiStatus = 'loading' | 'ready' | 'error'

const empty: ApiDataset = { posts: [], members: [], comments: [] }

/**
 * Gère le cycle de vie des données distantes : chargement initial,
 * rafraîchissement manuel et remontée des erreurs.
 *
 * Le compteur `revision` déclenche le même effet à chaque actualisation,
 * sans multiplier les appels HTTP dans les composants de présentation.
 */
export function useRemoteDataset() {
  const [data, setData] = useState<ApiDataset>(empty)
  const [status, setStatus] = useState<ApiStatus>('loading')
  const [error, setError] = useState('')
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    setError('')

    fetchApiDataset(controller.signal)
      .then((dataset) => {
        if (controller.signal.aborted) return
        setData(dataset)
        setStatus('ready')
      })
      .catch((reason: unknown) => {
        if (controller.signal.aborted) return
        setStatus('error')
        setError(reason instanceof Error ? reason.message : 'API externe indisponible.')
      })

    // Annule les requêtes précédentes lors du démontage ou d'un nouveau chargement.
    return () => controller.abort()
  }, [revision])

  // Les compteurs reflètent les tableaux effectivement reçus de DummyJSON.
  const counts = useMemo(
    () => ({
      posts: data.posts.length,
      members: data.members.length,
      comments: data.comments.length,
    }),
    [data],
  )

  const reload = useCallback(() => setRevision((value) => value + 1), [])

  return { data, status, error, counts, reload }
}
