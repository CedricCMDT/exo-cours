import type { HTMLAttributes, ReactNode } from 'react'

type PanelProps = HTMLAttributes<HTMLElement> & {
  title?: string
  eyebrow?: string
  children: ReactNode
}

/** Panneau générique du design system, utilisable dans n'importe quelle page. */
export function Panel({ title, eyebrow, children, className, ...props }: PanelProps) {
  return (
    <section {...props} className={['ui-panel', className].filter(Boolean).join(' ')}>
      {eyebrow && <p className="ui-panel__eyebrow">{eyebrow}</p>}
      {title && <h2 className="ui-panel__title">{title}</h2>}
      {children}
    </section>
  )
}
