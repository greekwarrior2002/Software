import { useState } from 'react'
import { differenceInMinutes, formatISO } from 'date-fns'
import type { SleepSession } from '../../types/schema'

type NewSession = Omit<SleepSession, 'id'>

interface Props {
  onSave: (s: NewSession) => Promise<void>
  onCancel: () => void
}

export default function AddSleepForm({ onSave, onCancel }: Props) {
  const now = new Date()
  const [startTime, setStartTime] = useState(formatLocal(new Date(now.getTime() - 8 * 3600_000)))
  const [endTime,   setEndTime]   = useState(formatLocal(now))
  const [quality,   setQuality]   = useState<number | null>(null)
  const [notes,     setNotes]     = useState('')
  const [saving,    setSaving]    = useState(false)

  const valid = endTime > startTime

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    setSaving(true)
    const start = new Date(startTime)
    const end   = new Date(endTime)
    await onSave({
      startTime:       formatISO(start),
      endTime:         formatISO(end),
      durationMinutes: differenceInMinutes(end, start),
      quality,
      source:  'web',
      notes:   notes || undefined,
    })
    setSaving(false)
  }

  return (
    <div className="modal-overlay">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>Log Sleep</h2>

        <label>Bedtime<input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required /></label>
        <label>Wake time<input type="datetime-local" value={endTime}   onChange={e => setEndTime(e.target.value)}   required /></label>

        <fieldset>
          <legend>Quality</legend>
          <div className="star-picker">
            {[null, 1, 2, 3, 4, 5].map(v => (
              <button key={v ?? 0} type="button" className={quality === v ? 'selected' : ''}
                onClick={() => setQuality(v)}>
                {v == null ? '–' : '★'.repeat(v)}
              </button>
            ))}
          </div>
        </fieldset>

        <label>Notes<textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} /></label>

        <div className="form-actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" disabled={!valid || saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </form>
    </div>
  )
}

function formatLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
