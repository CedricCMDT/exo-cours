import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type Theme = 'light' | 'dark'

type PreferencesValue = {
  savedIds: number[]
  toggleSaved: (id: number) => void
  theme: Theme
  toggleTheme: () => void
  onServerBoot: (bootId: string) => void
}

const PreferencesContext = createContext<PreferencesValue | null>(null)

function readBookmarks(): number[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem('afterhours-saved') || '[]')
    return Array.isArray(value)
      ? [...new Set(value.filter((id): id is number => typeof id === 'number'))]
      : []
  } catch {
    return []
  }
}

function readTheme(): Theme {
  try {
    return localStorage.getItem('afterhours-future-theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

/**
 * Préférences du navigateur : favoris et thème.
 * Elles ne dépendent ni du catalogue distant ni des actions de session.
 */
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<number[]>(readBookmarks)
  const [theme, setTheme] = useState<Theme>(readTheme)

  const toggleSaved = useCallback((id: number) => {
    setSavedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    )
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  // Les données du serveur sont temporaires : les favoris d'une ancienne
  // session sont vidés lorsque l'identifiant de démarrage change.
  const onServerBoot = useCallback((bootId: string) => {
    try {
      const previousBoot = localStorage.getItem('afterhours-boot-id')
      if (previousBoot !== bootId) {
        localStorage.removeItem('afterhours-saved')
        localStorage.setItem('afterhours-boot-id', bootId)
        setSavedIds([])
      }
    } catch {
      // Les préférences restent utilisables sans accès au stockage navigateur.
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('afterhours-saved', JSON.stringify(savedIds))
    } catch {
      // L'affichage fonctionne également lorsque le stockage est bloqué.
    }
  }, [savedIds])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('afterhours-future-theme', theme)
    } catch {
      // Le thème reste actif pendant la session navigateur.
    }
  }, [theme])

  const value = useMemo(
    () => ({ savedIds, toggleSaved, theme, toggleTheme, onServerBoot }),
    [savedIds, toggleSaved, theme, toggleTheme, onServerBoot],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const value = useContext(PreferencesContext)
  if (!value) throw new Error('PreferencesProvider manquant')
  return value
}
