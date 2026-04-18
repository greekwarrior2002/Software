import { useState, useEffect, useCallback } from 'react'
import { fetchSleepSessions, saveSleepSession, deleteSleepSession } from '../cloudkit/records'
import type { SleepSession } from '../types/schema'

export function useSleepSessions() {
  const [sessions, setSessions] = useState<SleepSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setSessions(await fetchSleepSessions())
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const save = useCallback(async (session: Omit<SleepSession, 'id'> & { id?: string }) => {
    const saved = await saveSleepSession(session)
    setSessions(prev => {
      const idx = prev.findIndex(s => s.id === saved.id)
      return idx >= 0 ? prev.with(idx, saved) : [saved, ...prev]
    })
    return saved
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteSleepSession(id)
    setSessions(prev => prev.filter(s => s.id !== id))
  }, [])

  return { sessions, loading, error, reload: load, save, remove }
}
