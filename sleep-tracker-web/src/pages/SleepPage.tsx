import { useState } from 'react'
import { useSleepSessions } from '../hooks/useSleepSessions'
import AddSleepForm from '../components/sleep/AddSleepForm'
import SleepList from '../components/sleep/SleepList'

export default function SleepPage() {
  const { sessions, loading, error, save, remove } = useSleepSessions()
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="page-header">
        <h1>Sleep</h1>
        <button onClick={() => setShowForm(true)}>+ Log</button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? <p>Loading…</p> : <SleepList sessions={sessions} onDelete={remove} />}

      {showForm && (
        <AddSleepForm
          onSave={async (s) => { await save(s); setShowForm(false) }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
