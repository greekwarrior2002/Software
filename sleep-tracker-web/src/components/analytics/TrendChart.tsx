import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { startOfWeek, addDays, format, parseISO } from 'date-fns'
import type { SleepSession } from '../../types/schema'

interface Props { sessions: SleepSession[] }

export default function TrendChart({ sessions }: Props) {
  const data = useMemo(() => {
    const weeks = new Map<string, { qualities: number[]; count: number }>()
    for (const s of sessions) {
      if (s.quality == null) continue
      const wk = format(startOfWeek(parseISO(s.startTime)), 'yyyy-MM-dd')
      if (!weeks.has(wk)) weeks.set(wk, { qualities: [], count: 0 })
      weeks.get(wk)!.qualities.push(s.quality)
      weeks.get(wk)!.count++
    }
    return Array.from(weeks.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, { qualities }]) => ({
        week: format(addDays(parseISO(week), 3), 'MMM d'),
        quality: +(qualities.reduce((a, b) => a + b, 0) / qualities.length).toFixed(2),
      }))
  }, [sessions])

  if (data.length < 2) return <p className="chart-empty">Not enough data for trend chart.</p>

  return (
    <div className="chart-box">
      <h3>Sleep Quality Trend</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="week" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} width={20} />
          <Tooltip formatter={(v: number) => [`${v}/5`, 'Avg Quality']} />
          <Line type="monotone" dataKey="quality" stroke="#6366f1" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
