export interface CorrelationPoint {
  factorValue: number
  quality: number
}

export interface CorrelationResult {
  r: number
  n: number
  strength: 'none' | 'weak' | 'moderate' | 'strong'
  label: string
}

export function pearson(xs: number[], ys: number[]): number {
  if (xs.length !== ys.length || xs.length < 2) return 0
  const n = xs.length
  const xMean = xs.reduce((a, b) => a + b, 0) / n
  const yMean = ys.reduce((a, b) => a + b, 0) / n
  const num  = xs.reduce((acc, x, i) => acc + (x - xMean) * (ys[i] - yMean), 0)
  const dx   = xs.reduce((acc, x) => acc + (x - xMean) ** 2, 0)
  const dy   = ys.reduce((acc, y) => acc + (y - yMean) ** 2, 0)
  const denom = Math.sqrt(dx * dy)
  return denom === 0 ? 0 : num / denom
}

export function correlationStrength(r: number, n: number): CorrelationResult['strength'] {
  if (n < 7) return 'none'
  const abs = Math.abs(r)
  if (abs < 0.2) return 'none'
  if (abs < 0.4) return 'weak'
  if (abs < 0.6) return 'moderate'
  return 'strong'
}

export function correlationLabel(r: number, n: number): string {
  if (n < 7) return 'Not enough data'
  const abs = Math.abs(r)
  if (abs < 0.2) return 'No clear relationship'
  const dir = r > 0 ? 'positive' : 'negative'
  if (abs < 0.4) return `Weak ${dir}`
  if (abs < 0.6) return `Moderate ${dir}`
  return `Strong ${dir}`
}
