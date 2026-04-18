import { useState, useEffect, useCallback } from 'react'
import { fetchLifestyleEntries, saveLifestyleEntry, deleteLifestyleEntry } from '../cloudkit/records'
import type { LifestyleEntry } from '../types/schema'

export function useLifestyleEntries(date?: string) {
  const [entries, setEntries] = useState<LifestyleEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setEntries(await fetchLifestyleEntries(date))
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [date])

  useEffect(() => { load() }, [load])

  const save = useCallback(async (entry: Omit<LifestyleEntry, 'id'> & { id?: string }) => {
    const saved = await saveLifestyleEntry(entry)
    setEntries(prev => {
      const idx = prev.findIndex(e => e.id === saved.id)
      return idx >= 0 ? prev.with(idx, saved) : [saved, ...prev]
    })
    return saved
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteLifestyleEntry(id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  return { entries, loading, error, reload: load, save, remove }
}
