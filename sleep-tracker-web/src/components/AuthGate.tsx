import { useEffect, useState, type ReactNode } from 'react'
import { signIn, isSignedIn } from '../cloudkit/client'

export default function AuthGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(isSignedIn())
  const [loading, setLoading] = useState(!isSignedIn())

  useEffect(() => {
    if (authed) return
    signIn()
      .then(() => setAuthed(isSignedIn()))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [authed])

  if (loading) return <div className="auth-loading">Signing in with Apple…</div>
  if (!authed) return (
    <div className="auth-prompt">
      <p>Sign in with Apple to access your sleep data.</p>
      <button onClick={() => { setLoading(true); signIn().then(() => { setAuthed(isSignedIn()); setLoading(false) }) }}>
        Sign in with Apple
      </button>
    </div>
  )
  return <>{children}</>
}
