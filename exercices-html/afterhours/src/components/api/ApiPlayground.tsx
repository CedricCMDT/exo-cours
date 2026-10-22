import { useState } from 'react'
import { Button } from '../ui/Button'
import { Panel } from '../ui/Panel'
import { demoRequests, tryDemoRequest } from '../../services/demoApi'
import type { DemoMethod } from '../../services/demoApi'

/**
 * LABORATOIRE HTTP
 *
 * Un seul bouton par verbe REST. Le code est volontairement très lisible :
 * on construit une URL, on lance fetch(), puis on affiche le JSON reçu.
 *
 * DummyJSON simule POST, PATCH et DELETE : il ne change PAS sa base de données.
 * Les vrais messages du visiteur restent enregistrés dans /session-api.
 */
export function ApiPlayground() {
  const [result, setResult] = useState('')
  const [lastDemoMethod, setLastDemoMethod] = useState<DemoMethod | null>(null)
  const [httpStatus, setHttpStatus] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  async function test(method: DemoMethod) {
    setLoading(true)
    setLastDemoMethod(method)
    setResult('')
    setHttpStatus(null)

    try {
      // C'est une vraie requête HTTP : visible dans F12 > Réseau.
      const response = await tryDemoRequest(method)
      setHttpStatus(response.status)
      const json: unknown = response.payload
      // Extrait affiché pour garder la console compacte.
      setResult(JSON.stringify(json, null, 2).slice(0, 1700))
    } catch (reason) {
      setResult(reason instanceof Error ? reason.message : 'Connexion impossible')
    } finally {
      setLoading(false)
    }
  }

  return <Panel className="api-lab" aria-labelledby="api-lab-title">
    <small>04 / LABORATOIRE REST</small>
    <h3 id="api-lab-title">JOUE AVEC <em>L'API.</em></h3>
    <p>Appels HTTP réels à DummyJSON. Les écritures sont simulées par le fournisseur.</p>
    <div className="api-lab-methods">
      {(['GET', 'POST', 'PATCH', 'DELETE'] as const).map(method =>
        <Button variant="ghost" size="sm" key={method} loading={loading}
          aria-pressed={lastDemoMethod === method}
          onClick={() => void test(method)}>{method}</Button>)}
    </div>
    {lastDemoMethod && <div className="api-lab-result">
      <strong>{loading ? 'REQUÊTE EN COURS…' : `HTTP ${httpStatus ?? 'ERREUR'} · ${lastDemoMethod}`}</strong>
      <code>dummyjson.com{demoRequests[lastDemoMethod].path}</code>
      <pre>{result || (loading ? 'En attente de la réponse…' : '')}</pre>
    </div>}
    <small>F12 → RÉSEAU : tu peux observer les quatre méthodes.</small>
  </Panel>
}
