import { useId } from 'react'
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

type CommonField = { label: string; hint?: string; error?: string; className?: string }

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & CommonField

/**
 * Champ de formulaire réutilisable.
 * useId() génère un identifiant stable pour associer le label et le contrôle
 * lorsque le composant est utilisé plusieurs fois sur une page.
 */
export function InputField({ label, hint, error, className, id, ...input }: InputFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const messageId = `${fieldId}-message`
  return (
    <div className={['ui-field', className].filter(Boolean).join(' ')}>
      <label htmlFor={fieldId} className="ui-field__label">{label}</label>
      <input
        {...input}
        id={fieldId}
        className="ui-field__control"
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={hint || error ? messageId : undefined}
      />
      {(hint || error) && (
        <small id={messageId} className={error ? 'ui-field__error' : 'ui-field__hint'}>
          {error || hint}
        </small>
      )}
    </div>
  )
}

// Les mêmes propriétés de présentation sont utilisées pour les champs multilignes.
type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & CommonField

export function TextareaField({ label, hint, error, className, id, ...textarea }: TextareaFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <div className={['ui-field', className].filter(Boolean).join(' ')}>
      <label htmlFor={fieldId} className="ui-field__label">{label}</label>
      <textarea
        {...textarea}
        id={fieldId}
        className="ui-field__control"
        aria-invalid={Boolean(error) || undefined}
      />
      {(hint || error) && <small className={error ? 'ui-field__error' : 'ui-field__hint'}>{error || hint}</small>}
    </div>
  )
}

// Même contrat de label et de présentation pour les listes déroulantes.
type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & CommonField

export function SelectField({ label, hint, error, className, id, children, ...select }: SelectFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  return (
    <div className={['ui-field', className].filter(Boolean).join(' ')}>
      <label htmlFor={fieldId} className="ui-field__label">{label}</label>
      <select {...select} id={fieldId} className="ui-field__control">{children}</select>
      {(hint || error) && <small className={error ? 'ui-field__error' : 'ui-field__hint'}>{error || hint}</small>}
    </div>
  )
}
