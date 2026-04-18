import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { LifestyleCategory } from '../../types/schema'
import { LIFESTYLE_CATEGORIES } from '../../types/schema'
import type { CategoryCorrelation } from '../../hooks/useCorrelations'

interface Props {
  correlations: CategoryCorrelation[]
  selected: LifestyleCategory
  onSelect: (c: LifestyleCategory) => void
}

export default function CorrelationChart({ correlations, selected, onSelect }: Props) {
  const current = correlations.find(c => c.category === selected)

  return (
    <div className="chart-box">
      <h3>Factor Correlation</h3>

      <select value={selected} onChange={e => onSelect(e.target.value as LifestyleCategory)}>
        {LIFESTYLE_CATEGORIES.map(c => (
          <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
        ))}
      </select>

      {current && (
        current.n < 7
          ? <p className="chart-empty">Not enough data (need 7+ nights with both quality rating and {current.label.toLowerCase()} logged).</p>
          : (
            <>
              <p className="correlation-label">
                r = {current.r.toFixed(2)} — {current.description} (n={current.n})
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="factorValue" name={current.label} type="number" />
                  <YAxis dataKey="quality" name="Quality" domain={[0, 5]} ticks={[1,2,3,4,5]} width={20} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={current.points} fill="#6366f1" opacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </>
          )
      )}
    </div>
  )
}
