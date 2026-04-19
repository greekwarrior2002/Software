import { describe, it, expect } from 'vitest'
import { pearson, correlationLabel, correlationStrength } from './stats'

describe('pearson', () => {
  it('returns 1 for perfect positive correlation', () => {
    expect(pearson([1, 2, 3, 4, 5], [2, 4, 6, 8, 10])).toBeCloseTo(1)
  })

  it('returns -1 for perfect negative correlation', () => {
    expect(pearson([1, 2, 3, 4, 5], [10, 8, 6, 4, 2])).toBeCloseTo(-1)
  })

  it('returns 0 for constant y', () => {
    expect(pearson([1, 2, 3], [5, 5, 5])).toBe(0)
  })

  it('returns 0 for fewer than 2 points', () => {
    expect(pearson([1], [1])).toBe(0)
    expect(pearson([], [])).toBe(0)
  })
})

describe('correlationStrength', () => {
  it('returns none when n < 7', () => {
    expect(correlationStrength(0.9, 6)).toBe('none')
  })
  it('classifies correctly', () => {
    expect(correlationStrength(0.1, 10)).toBe('none')
    expect(correlationStrength(0.3, 10)).toBe('weak')
    expect(correlationStrength(0.5, 10)).toBe('moderate')
    expect(correlationStrength(0.7, 10)).toBe('strong')
  })
})

describe('correlationLabel', () => {
  it('shows not enough data for small n', () => {
    expect(correlationLabel(0.8, 5)).toBe('Not enough data')
  })
  it('shows direction', () => {
    expect(correlationLabel(-0.6, 20)).toContain('negative')
    expect(correlationLabel(0.6, 20)).toContain('positive')
  })
})
