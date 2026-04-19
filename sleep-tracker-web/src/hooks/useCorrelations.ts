import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { pearson, correlationLabel, correlationStrength } from '../utils/stats'
import type { SleepSession, LifestyleEntry, LifestyleCategory } from '../types/schema'
import { LIFESTYLE_CATEGORIES } from '../types/schema'

export interface CategoryCorrelation {
  category: LifestyleCategory
  label: string
  r: number
  n: number
  strength: ReturnType<typeof correlationStrength>
  description: string
  points: { factorValue: number; quality: number; date: string }[]
}

function sleepDate(session: SleepSession): string {
  const start = parseISO(session.startTime)
  // If sleep started before 6 AM, attribute it to the previous calendar day
  const h = start.getHours()
  const base = h < 6
    ? new Date(start.getFullYear(), start.getMonth(), start.getDate() - 1)
    : start
  return format(base, 'yyyy-MM-dd')
}

export function useCorrelations(sessions: SleepSession[], entries: LifestyleEntry[]): CategoryCorrelation[] {
  return useMemo(() => {
    const byDate = new Map<string, LifestyleEntry[]>()
    for (const e of entries) {
      if (!byDate.has(e.date)) byDate.set(e.date, [])
      byDate.get(e.date)!.push(e)
    }

    return LIFESTYLE_CATEGORIES.map(({ value: category, label }) => {
      const points: CategoryCorrelation['points'] = []
      for (const session of sessions) {
        if (session.quality == null) continue
        const date = sleepDate(session)
        const match = (byDate.get(date) ?? []).find(e => e.category === category)
        if (!match) continue
        points.push({ factorValue: match.value, quality: session.quality, date })
      }
      const r = pearson(points.map(p => p.factorValue), points.map(p => p.quality))
      return {
        category,
        label,
        r,
        n: points.length,
        strength: correlationStrength(r, points.length),
        description: correlationLabel(r, points.length),
        points,
      }
    })
  }, [sessions, entries])
}
