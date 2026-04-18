export type SleepSource = 'healthkit' | 'manual' | 'web'

export type LifestyleCategory =
  | 'caffeine'
  | 'alcohol'
  | 'exercise'
  | 'stress'
  | 'screen_time'
  | 'nap'
  | 'medication'
  | 'other'

export const LIFESTYLE_CATEGORIES: { value: LifestyleCategory; label: string; unit: string; icon: string }[] = [
  { value: 'caffeine',    label: 'Caffeine',     unit: 'mg',      icon: '☕' },
  { value: 'alcohol',     label: 'Alcohol',      unit: 'drinks',  icon: '🍷' },
  { value: 'exercise',    label: 'Exercise',     unit: 'minutes', icon: '🏃' },
  { value: 'stress',      label: 'Stress',       unit: '1-10',    icon: '🧠' },
  { value: 'screen_time', label: 'Screen Time',  unit: 'minutes', icon: '📱' },
  { value: 'nap',         label: 'Nap',          unit: 'minutes', icon: '💤' },
  { value: 'medication',  label: 'Medication',   unit: 'dose',    icon: '💊' },
  { value: 'other',       label: 'Other',        unit: '',        icon: '•'  },
]

export interface SleepSession {
  id: string         // CloudKit record name
  startTime: string  // ISO8601
  endTime: string    // ISO8601
  durationMinutes: number
  quality: number | null
  source: SleepSource
  notes?: string
}

export interface LifestyleEntry {
  id: string         // CloudKit record name
  date: string       // YYYY-MM-DD
  category: LifestyleCategory
  value: number
  unit: string
  notes?: string
}
