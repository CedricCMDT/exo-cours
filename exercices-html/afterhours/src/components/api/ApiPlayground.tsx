import { useState } from 'react'

/**
 * LABORATOIRE HTTP
 *
 * Un seul bouton par verbe REST. Le code est volontairement très lisible :
 * on construit une URL, on lance fetch(), puis on affiche le JSON reçu.
 *
 * DummyJSON simule POST, PATCH et DELETE : il ne change PAS sa base de données.
 * Les vrais messages du visiteur restent enregistrés dans /session-api.
 */
type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

const requests: Record<Method, { path: string; data?: object }> = {
  GET: { path: '/posts/1' },
  POST: {
    path: '/posts/add',
    data: { title: 'Afterhours : test API', body: 'POST de démonstration', userId: 1 },
  },
  PATCH: { path: '/posts/1', data: { title: 'Titre modifié (simulation)' } },
  DELETE: { path: '/posts/1' },
}

export function ApiPlayground() {
  const [result, setResult] = useState('')
  const [lastMethod, setLastMethod] = useState<Method | null>(null)
  const [httpStatus, setHttpStatus] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  async function test(method: Method) {
    const request = requests[method]
    setLoading(true)
    setLastMethod(method)
    setResult('')
    setHttpStatus(null)

    try {
      // C'est une vraie requête HTTP : visible dans F12 > Réseau.
      const response = await fetch('https://dummyjson.com' + request.path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: request.data ? JSON.stringify(request.data) : undefined,
      })
      setHttpStatus(response.status)
      const json: unknown = await response.json()
      // Extrait affiché pour garder la console compacte.
      setResult(JSON.stringify(json, null, 2).slice(0, 1700))
    } catch (reason) {
      setResult(reason instanceof Error ? reason.message : 'Connexion impossible')
    } finally {
      setLoading(false)
    }
  }

  return <section className="api-lab" aria-labelledby="api-lab-title">
    <small>04 / LABORATOIRE REST</small>
    <h3 id="api-lab-title">JOUE AVEC <em>L'API.</em></h3>
    <p>Appels HTTP réels à DummyJSON. Les écritures sont simulées par le fournisseur.</p>
    <div className="api-lab-methods">
      {(['GET', 'POST', 'PATCH', 'DELETE'] as const).map(method =>
        <button type="button" key={method} disabled={loading}
          aria-pressed={lastMethod === method}
          onClick={() => void test(method)}>{method}</button>)}
    </div>
    {lastMethod && <div className="api-lab-result">
      <strong>{loading ? 'REQUÊTE EN COURS…' : `HTTP ${httpStatus ?? 'ERREUR'} · ${lastMethod}`}</strong>
      <code>dummyjson.com{requests[lastMethod].path}</code>
      <pre>{result || (loading ? 'En attente de la réponse…' : '')}</pre>
    </div>}
    <small>F12 → RÉSEAU : tu peux observer les quatre méthodes.</small>
  </section>
}
