/**
 * Client HTTP unique du forum temporaire.
 *
 * Le navigateur parle au serveur Vite sur /session-api.
 * Contrairement à une API distante, le serveur local conserve les données
 * uniquement dans sa mémoire vive et les perd quand il redémarre.
 */
export async function sessionRequest<T>(
  path: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  data?: unknown,
): Promise<T> {
  const response = await fetch('/session-api' + path, {
    method,
    credentials: 'same-origin', // Envoie le cookie de session du navigateur.
    headers: { 'Content-Type': 'application/json' },
    body: data === undefined ? undefined : JSON.stringify(data),
  })

  const result = await response.json()

  // Une erreur HTTP devient une erreur JavaScript que le formulaire peut afficher.
  if (!response.ok) {
    throw new Error(result.error || 'Le serveur local ne répond pas correctement.')
  }
  return result as T
}
