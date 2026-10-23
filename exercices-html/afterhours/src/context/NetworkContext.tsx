import type { ReactNode } from 'react'
import { PreferencesProvider } from './PreferencesContext'
import { SessionProvider } from './SessionContext'
import { ForumProvider } from './ForumContext'
import { FeedQueryProvider } from './FeedQueryContext'

/**
 * Racine des contextes de l'application.
 *
 * Chaque Provider possède une responsabilité clairement délimitée :
 * préférences → session → catalogue → filtres du fil.
 * Les pages utilisent directement le hook du contexte qui les concerne.
 */
export function NetworkProvider({ children }: { children: ReactNode }) {
  return (
    <PreferencesProvider>
      <SessionProvider>
        <ForumProvider>
          <FeedQueryProvider>{children}</FeedQueryProvider>
        </ForumProvider>
      </SessionProvider>
    </PreferencesProvider>
  )
}
