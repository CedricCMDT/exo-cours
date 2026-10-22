import type { ReactNode } from 'react'

type PageHeaderProps = {
  eyebrow: string
  title: ReactNode
  description?: string
  className?: string
}

/**
 * En-tête réutilisable pour les pages internes (compte, création, favoris).
 * Le HTML reste sémantique : les styles sont portés par des classes CSS et
 * non par des sélecteurs d'éléments du type "header h1".
 */
export function PageHeader({ eyebrow, title, description, className = '' }: PageHeaderProps) {
  return (
    <div className={['section-header', 'page-heading', className].filter(Boolean).join(' ')}>
      <span className="page-heading__eyebrow">{eyebrow}</span>
      <h1 className="page-heading__title">{title}</h1>
      {description && <p className="page-heading__description">{description}</p>}
    </div>
  )
}
