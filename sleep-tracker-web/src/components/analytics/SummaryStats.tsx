import type { SleepSession } from '../../types/schema'
import { differenceInMinutes, parseISO } from 'date-fns'

interface Props { sessions: SleepSession[] }

export default function SummaryStats({ sessions }: Props) {
  const durations = sessions.map(s => differenceInMinutes(parseISO(s.endTime), parseISO(s.startTime)) / 60)
  const avgDuration = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0

  const qualities = sessions.flatMap(s => s.quality != null ? [s.quality] : [])
  const avgQuality = qualities.length ? qualities.reduce((a, b) => a + b, 0) / qualities.length : 0

  return (
    <div className="stats-row">
      <StatCell label="Avg Duration"  value={avgDuration > 0 ? `${avgDuration.toFixed(1)}h` : '–'} />
      <StatCell label="Avg Quality"   value={avgQuality > 0  ? `${avgQuality.toFixed(1)}/5`  : '–'} />
      <StatCell label="Nights Logged" value={String(sessions.length)} />
    </div>
  )
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-cell">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
