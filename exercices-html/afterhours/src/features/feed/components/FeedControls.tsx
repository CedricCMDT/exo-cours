import { Button } from '../../../components/ui/Button'
import { InputField, SelectField } from '../../../components/ui/Fields'
import type { Query } from '../../../types'
import type { FeedOrder } from '../selectors'

type FeedControlsProps = {
  query: Query
  order: FeedOrder
  categories: { slug: string; label: string; count: number }[]
  onCriteriaChange: (criteria: Partial<Omit<Query, 'page'>>) => void
  onOrderChange: (order: FeedOrder) => void
}

const choices: { value: FeedOrder; label: string }[] = [
  { value: 'recent', label: 'LES DERNIERS' },
  { value: 'clash', label: 'ÇA DIVISE' },
  { value: 'popular', label: 'SURCHAUFFE' },
  { value: 'ignored', label: 'LES OUBLIÉS' },
]

/** Les champs et les tris n'importent aucune API : ce composant est présentational. */
export function FeedControls({
  query,
  order,
  categories,
  onCriteriaChange,
  onOrderChange,
}: FeedControlsProps) {
  return (
    <>
      <form className="filter-panel future-filter" onSubmit={(event) => event.preventDefault()}>
        <InputField
          label="RECHERCHER"
          type="search"
          value={query.text}
          placeholder="Une polémique, un pseudo, un sujet…"
          onChange={(event) => onCriteriaChange({ text: event.target.value })}
        />
        <SelectField
          label="CATÉGORIE"
          value={query.tag}
          onChange={(event) => onCriteriaChange({ tag: event.target.value })}
        >
          <option value="">Toutes</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              /{category.label}/
            </option>
          ))}
        </SelectField>
        <SelectField
          label="POPULARITÉ"
          value={query.popularity}
          onChange={(event) => onCriteriaChange({ popularity: event.target.value })}
        >
          <option value="all">Toutes</option>
          <option value="popular">100+ likes</option>
          <option value="quiet">Moins de 100</option>
        </SelectField>
      </form>
      <div className="future-sort-tabs" role="group" aria-label="Trier les discussions">
        {choices.map((choice) => (
          <Button
            key={choice.value}
            variant="ghost"
            size="sm"
            aria-pressed={order === choice.value}
            onClick={() => onOrderChange(choice.value)}
          >
            {choice.label}
          </Button>
        ))}
      </div>
    </>
  )
}
