import { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { LifestyleEntry } from '../types/schema'

export function useLifestyleEntries(date?: string) {
  const entries = useLiveQuery(
    () => date
      ? db.lifestyleEntries.where('date').equals(date).toArray()
      : db.lifestyleEntries.orderBy('date').reverse().toArray(),
    [date],
    [] as LifestyleEntry[]
  )

  const save = useCallback(async (entry: Omit<LifestyleEntry, 'id'> & { id?: string }) => {
    const id = entry.id ?? crypto.randomUUID()
    const record: LifestyleEntry = { ...entry, id }
    await db.lifestyleEntries.put(record)
    return record
  }, [])

  const remove = useCallback(async (id: string) => {
    await db.lifestyleEntries.delete(id)
  }, [])

  return { entries, loading: entries === undefined, error: null, save, remove }
}
