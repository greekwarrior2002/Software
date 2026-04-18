import { useState } from 'react'
import { format } from 'date-fns'
import type { LifestyleEntry, LifestyleCategory } from '../../types/schema'
import { LIFESTYLE_CATEGORIES } from '../../types/schema'

type NewEntry = Omit<LifestyleEntry, 'id'>

interface Props {
  onSave: (e: NewEntry) => Promise<void>
  onCancel: () => void
}

export default function AddLifestyleForm({ onSave, onCancel }: Props) {
  const [date,     setDate]     = useState(format(new Date(), 'yyyy-MM-dd'))
  const [category, setCategory] = useState<LifestyleCategory>('caffeine')
  const [value,    setValue]    = useState('')
  const [notes,    setNotes]    = useState('')
  const [saving,   setSaving]   = useState(false)

  const meta = LIFESTYLE_CATEGORIES.find(c => c.value === category)!
  const valid = value !== '' && !isNaN(Number(value)) && Number(value) >= 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    setSaving(true)
    await onSave({ date, category, value: Number(value), unit: meta.unit, notes: notes || undefined })
    setSaving(false)
  }

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>Log Factor</h2>

        <label>Date<input type="date" value={date} onChange={e => setDate(e.target.value)} required /></label>

        <label>Category
          <select value={category} onChange={e => setCategory(e.target.value as LifestyleCategory)}>
            {LIFESTYLE_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
            ))}
          </select>
        </label>

        <label>Amount
          <div className="input-with-unit">
            <input type="number" min="0" step="any" value={value} onChange={e => setValue(e.target.value)} required />
            {meta.unit && <span className="unit">{meta.unit}</span>}
          </div>
        </label>

        <label>Notes<textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></label>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" disabled={!valid || saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  )
}
