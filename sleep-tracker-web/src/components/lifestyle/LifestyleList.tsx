import type { LifestyleEntry } from '../../types/schema'
import { LIFESTYLE_CATEGORIES } from '../../types/schema'

interface Props {
  entries: LifestyleEntry[]
  onDelete: (id: string) => void
}

export default function LifestyleList({ entries, onDelete }: Props) {
  if (entries.length === 0) return <p className="empty">No lifestyle entries yet. Tap + to log a factor.</p>

  return (
    <ul className="record-list">
      {entries.map(e => {
        const meta = LIFESTYLE_CATEGORIES.find(c => c.value === e.category)
        return (
          <li key={e.id} className="record-row">
            <span className="category-icon">{meta?.icon}</span>
            <div className="record-main">
              <span className="record-label">{meta?.label ?? e.category}</span>
              <span className="record-date">{e.date}</span>
            </div>
            <span className="record-value">{e.value} {e.unit}</span>
            <button className="delete-btn" onClick={() => onDelete(e.id)} aria-label="Delete">✕</button>
          </li>
        )
      })}
    </ul>
  )
}
