import { useState } from 'react'
import { useLifestyleEntries } from '../hooks/useLifestyleEntries'
import AddLifestyleForm from '../components/lifestyle/AddLifestyleForm'
import LifestyleList from '../components/lifestyle/LifestyleList'

export default function LifestylePage() {
  const { entries, loading, error, save, remove } = useLifestyleEntries()
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <div className="page-header">
        <h1>Lifestyle</h1>
        <button onClick={() => setShowForm(true)}>+ Log</button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading ? <p>Loading…</p> : <LifestyleList entries={entries} onDelete={remove} />}

      {showForm && (
        <AddLifestyleForm
          onSave={async (e) => { await save(e); setShowForm(false) }}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
