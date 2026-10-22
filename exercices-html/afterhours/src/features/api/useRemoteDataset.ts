import { useEffect, useMemo, useState } from 'react'
import { fetchApiDataset } from '../../services/api'
import type { ApiDataset } from '../../services/api'

/** La récupération HTTP est isolée de l'interface : le contexte consomme ce hook. */
export type ApiStatus = 'loading' | 'ready' | 'error'

const empty: ApiDataset = { posts: [], members: [], comments: [] }

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

    // Important avec React.StrictMode : annule les anciennes requêtes.
    return () => controller.abort()
  }, [revision])

  const counts = useMemo(
    () => ({
      posts: data.posts.length,
      members: data.members.length,
      comments: data.comments.length,
    }),
    [data],
  )

  return { data, status, error, counts, reload: () => setRevision((value) => value + 1) }
}
