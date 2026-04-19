import { db } from './db'
import type { SleepSession, LifestyleEntry } from '../types/schema'

interface BackupFile {
  sleepSessions: SleepSession[]
  lifestyleEntries: LifestyleEntry[]
}

export async function importFromJSON(file: File): Promise<{ sessions: number; entries: number }> {
  const text = await file.text()
  const data = JSON.parse(text) as BackupFile

  if (!Array.isArray(data.sleepSessions) || !Array.isArray(data.lifestyleEntries)) {
    throw new Error('Invalid backup file — missing sleepSessions or lifestyleEntries.')
  }

  await Promise.all([
    db.sleepSessions.bulkPut(data.sleepSessions),
    db.lifestyleEntries.bulkPut(data.lifestyleEntries),
  ])

  return { sessions: data.sleepSessions.length, entries: data.lifestyleEntries.length }
}
