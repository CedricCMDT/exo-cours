/** Les méthodes d'écriture de DummyJSON simulent une mutation sans persistance. */
export type DemoMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'
export const demoRequests: Record<DemoMethod, { path: string; data?: object }> = {
  GET: { path: '/posts/1' },
  POST: {
    path: '/posts/add',
    data: { title: 'Afterhours : test API', body: 'POST de démonstration', userId: 1 },
  },
  PATCH: { path: '/posts/1', data: { title: 'Titre modifié (simulation)' } },
  DELETE: { path: '/posts/1' },
}

export async function tryDemoRequest(method: DemoMethod) {
  const request = demoRequests[method]
  const response = await fetch('https://dummyjson.com' + request.path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: request.data ? JSON.stringify(request.data) : undefined,
  })
  const payload: unknown = await response.json()
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return { status: response.status, payload }
}
