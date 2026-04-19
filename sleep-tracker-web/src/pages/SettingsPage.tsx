import { useRef, useState } from 'react'
import { exportToJSON } from '../db/export'
import { importFromJSON } from '../db/import'

export default function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null)

  async function handleExport() {
    try {
      await exportToJSON()
      setMessage({ text: 'Backup downloaded.', ok: true })
    } catch {
      setMessage({ text: 'Export failed.', ok: false })
    }
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const { sessions, entries } = await importFromJSON(file)
      setMessage({ text: `Restored ${sessions} sleep records and ${entries} lifestyle entries.`, ok: true })
    } catch (err) {
      setMessage({ text: String(err), ok: false })
    }
    e.target.value = ''
  }

  return (
    <div>
      <h1>Settings</h1>

      <div className="settings-section">
        <h2>Backup &amp; Restore</h2>
        <p className="settings-desc">Your data lives in this browser. Use Export to save a backup file, and Import to restore it — on this device or any other.</p>

        <div className="settings-actions">
          <button onClick={handleExport}>⬇ Export backup</button>
          <button type="button" onClick={() => fileInputRef.current?.click()}>⬆ Restore from backup</button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </div>

        {message && (
          <p className={message.ok ? 'settings-ok' : 'error'}>{message.text}</p>
        )}
      </div>
    </div>
  )
}
