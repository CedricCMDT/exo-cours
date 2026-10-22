import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type VisualProps = {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  className?: string
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VisualProps & {
    loading?: boolean
    children: ReactNode
  }

/** Source unique des variantes de boutons : plus de styles copiés dans les pages. */
function buttonClass({ variant = 'secondary', size = 'md', fullWidth, className }: VisualProps) {
  return [
    'ui-button',
    `ui-button--${variant}`,
    `ui-button--${size}`,
    fullWidth && 'ui-button--full',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  children,
  variant,
  size,
  fullWidth,
  className,
  loading = false,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={buttonClass({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {children}
    </button>
  )
}

type ButtonLinkProps = LinkProps & VisualProps

/** Un lien qui ressemble à un bouton reste un vrai lien, pas un click handler. */
export function ButtonLink({
  children,
  variant,
  size,
  fullWidth,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={buttonClass({ variant, size, fullWidth, className })}
    >
      {children}
    </Link>
  )
}
