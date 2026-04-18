import { privateDB } from './client'
import type { SleepSession, LifestyleEntry, LifestyleCategory, SleepSource } from '../types/schema'
import { differenceInMinutes } from 'date-fns'

// ---------------------------------------------------------------------------
// SleepSession
// ---------------------------------------------------------------------------

export async function fetchSleepSessions(): Promise<SleepSession[]> {
  const response = await privateDB.performQuery({
    recordType: 'SleepSession',
    filterBy: [],
    sortBy: [{ fieldName: 'startTime', ascending: false }],
  })
  if (response.hasErrors) throw new Error(response.errors[0].serverErrorCode)
  return response.records.map(recordToSession)
}

export async function saveSleepSession(session: Omit<SleepSession, 'id'> & { id?: string }): Promise<SleepSession> {
  const record = {
    recordType: 'SleepSession',
    ...(session.id ? { recordName: session.id } : {}),
    fields: {
      startTime:       { value: new Date(session.startTime).getTime() / 1000, type: 'TIMESTAMP' },
      endTime:         { value: new Date(session.endTime).getTime() / 1000,   type: 'TIMESTAMP' },
      durationMinutes: { value: session.durationMinutes },
      quality:         { value: session.quality ?? null },
      source:          { value: session.source },
      notes:           { value: session.notes ?? null },
    },
  }
  const response = await privateDB.saveRecords([record])
  if (response.hasErrors) throw new Error(response.errors[0].serverErrorCode)
  return recordToSession(response.records[0])
}

export async function deleteSleepSession(id: string): Promise<void> {
  const response = await privateDB.deleteRecords([{ recordName: id, recordType: 'SleepSession' }])
  if (response.hasErrors) throw new Error(response.errors[0].serverErrorCode)
}

function recordToSession(r: Record<string, unknown>): SleepSession {
  const f = (r as { fields: Record<string, { value: unknown }> }).fields
  const startTime = new Date(Number(f.startTime.value) * 1000).toISOString()
  const endTime   = new Date(Number(f.endTime.value) * 1000).toISOString()
  return {
    id:              (r as { recordName: string }).recordName,
    startTime,
    endTime,
    durationMinutes: Number(f.durationMinutes?.value) || differenceInMinutes(new Date(endTime), new Date(startTime)),
    quality:         f.quality?.value != null ? Number(f.quality.value) : null,
    source:          String(f.source?.value ?? 'web') as SleepSource,
    notes:           f.notes?.value != null ? String(f.notes.value) : undefined,
  }
}

// ---------------------------------------------------------------------------
// LifestyleEntry
// ---------------------------------------------------------------------------

export async function fetchLifestyleEntries(date?: string): Promise<LifestyleEntry[]> {
  const filterBy = date
    ? [{ fieldName: 'date', comparator: 'EQUALS', fieldValue: { value: date } }]
    : []
  const response = await privateDB.performQuery({
    recordType: 'LifestyleEntry',
    filterBy,
    sortBy: [{ fieldName: 'date', ascending: false }],
  })
  if (response.hasErrors) throw new Error(response.errors[0].serverErrorCode)
  return response.records.map(recordToEntry)
}

export async function saveLifestyleEntry(entry: Omit<LifestyleEntry, 'id'> & { id?: string }): Promise<LifestyleEntry> {
  const record = {
    recordType: 'LifestyleEntry',
    ...(entry.id ? { recordName: entry.id } : {}),
    fields: {
      date:     { value: entry.date },
      category: { value: entry.category },
      value:    { value: entry.value },
      unit:     { value: entry.unit },
      notes:    { value: entry.notes ?? null },
    },
  }
  const response = await privateDB.saveRecords([record])
  if (response.hasErrors) throw new Error(response.errors[0].serverErrorCode)
  return recordToEntry(response.records[0])
}

export async function deleteLifestyleEntry(id: string): Promise<void> {
  const response = await privateDB.deleteRecords([{ recordName: id, recordType: 'LifestyleEntry' }])
  if (response.hasErrors) throw new Error(response.errors[0].serverErrorCode)
}

function recordToEntry(r: Record<string, unknown>): LifestyleEntry {
  const f = (r as { fields: Record<string, { value: unknown }> }).fields
  return {
    id:       (r as { recordName: string }).recordName,
    date:     String(f.date.value),
    category: String(f.category.value) as LifestyleCategory,
    value:    Number(f.value.value),
    unit:     String(f.unit?.value ?? ''),
    notes:    f.notes?.value != null ? String(f.notes.value) : undefined,
  }
}
