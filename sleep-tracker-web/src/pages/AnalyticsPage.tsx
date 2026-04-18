import { useState } from 'react'
import { useSleepSessions } from '../hooks/useSleepSessions'
import { useLifestyleEntries } from '../hooks/useLifestyleEntries'
import { useCorrelations } from '../hooks/useCorrelations'
import TrendChart from '../components/analytics/TrendChart'
import CorrelationChart from '../components/analytics/CorrelationChart'
import SummaryStats from '../components/analytics/SummaryStats'
import type { LifestyleCategory } from '../types/schema'

export default function AnalyticsPage() {
  const { sessions, loading: sl } = useSleepSessions()
  const { entries,  loading: el } = useLifestyleEntries()
  const correlations = useCorrelations(sessions, entries)
  const [selectedCategory, setSelectedCategory] = useState<LifestyleCategory>('caffeine')

  if (sl || el) return <p>Loading…</p>

  return (
    <div>
      <h1>Analytics</h1>
      <SummaryStats sessions={sessions} />
      <TrendChart sessions={sessions} />
      <CorrelationChart
        correlations={correlations}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
    </div>
  )
}
