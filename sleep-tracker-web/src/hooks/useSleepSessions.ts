import { useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/db'
import type { SleepSession } from '../types/schema'

export function useSleepSessions() {
  const sessions = useLiveQuery(
    () => db.sleepSessions.orderBy('startTime').reverse().toArray(),
    [],
    [] as SleepSession[]
  )

  const save = useCallback(async (session: Omit<SleepSession, 'id'> & { id?: string }) => {
    const id = session.id ?? crypto.randomUUID()
    const record: SleepSession = { ...session, id }
    await db.sleepSessions.put(record)
    return record
  }, [])

  const remove = useCallback(async (id: string) => {
    await db.sleepSessions.delete(id)
  }, [])

  return { sessions, loading: sessions === undefined, error: null, save, remove }
}
