import { format } from 'date-fns'
import { db } from './db'

export async function exportToJSON(): Promise<void> {
  const [sleepSessions, lifestyleEntries] = await Promise.all([
    db.sleepSessions.toArray(),
    db.lifestyleEntries.toArray(),
  ])

  const data = {
    exportedAt: new Date().toISOString(),
    sleepSessions,
    lifestyleEntries,
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sleep-tracker-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
  a.click()
  URL.revokeObjectURL(url)
}
