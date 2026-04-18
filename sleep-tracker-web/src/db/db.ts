import Dexie, { type Table } from 'dexie'
import type { SleepSession, LifestyleEntry } from '../types/schema'

class SleepTrackerDB extends Dexie {
  sleepSessions!: Table<SleepSession, string>
  lifestyleEntries!: Table<LifestyleEntry, string>

  constructor() {
    super('SleepTrackerDB')
    this.version(1).stores({
      sleepSessions:    '&id, startTime, endTime',
      lifestyleEntries: '&id, date, category',
    })
  }
}

export const db = new SleepTrackerDB()
