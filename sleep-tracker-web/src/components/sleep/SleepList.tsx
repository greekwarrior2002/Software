import { format, parseISO, differenceInMinutes } from 'date-fns'
import type { SleepSession } from '../../types/schema'

interface Props {
  sessions: SleepSession[]
  onDelete: (id: string) => void
}

export default function SleepList({ sessions, onDelete }: Props) {
  if (sessions.length === 0) return <p className="empty">No sleep records yet. Tap + to log a night.</p>

  return (
    <ul className="record-list">
      {sessions.map(s => (
        <li key={s.id} className="record-row">
          <div className="record-main">
            <span className="record-date">{format(parseISO(s.startTime), 'EEE, MMM d')}</span>
            <span className="record-times">
              {format(parseISO(s.startTime), 'h:mm a')} – {format(parseISO(s.endTime), 'h:mm a')}
            </span>
            <span className="record-duration">{formatDuration(differenceInMinutes(parseISO(s.endTime), parseISO(s.startTime)))}</span>
            {s.quality != null && <span className="record-quality">{'★'.repeat(s.quality)}{'☆'.repeat(5 - s.quality)}</span>}
          </div>
          {s.source !== 'healthkit' && (
            <button className="delete-btn" onClick={() => onDelete(s.id)} aria-label="Delete">✕</button>
          )}
        </li>
      ))}
    </ul>
  )
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}
