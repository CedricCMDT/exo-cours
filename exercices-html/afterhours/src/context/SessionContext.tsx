import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useLocalSession } from '../features/session/useLocalSession'
import { usePreferences } from './PreferencesContext'

type SessionValue = ReturnType<typeof useLocalSession>

const SessionContext = createContext<SessionValue | null>(null)

/**
 * Comptes, authentification et opérations CRUD : la couche session dispose
 * de son propre contexte, indépendamment des filtres ou du thème.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const { onServerBoot } = usePreferences()
  const session = useLocalSession(onServerBoot)

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}

export function useSession() {
  const value = useContext(SessionContext)
  if (!value) throw new Error('SessionProvider manquant')
  return value
}
