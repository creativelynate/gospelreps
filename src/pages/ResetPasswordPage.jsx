import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase puts tokens in the hash fragment
    // We need to let Supabase parse it and establish a session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleReset() {
    setError(null)
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else {
      setMessage('Password updated. Redirecting...')
      setTimeout(() => navigate('/'), 2000)
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 20 }}>

        <div>
          <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: 8 }}>
            Gospel Piano Trainer
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Set new password</h1>
          <p style={{ fontSize: 13, color: 'rgba(240,236,227,0.4)' }}>
            {ready ? 'Choose a strong password for your account.' : 'Verifying your reset link...'}
          </p>
        </div>

        {ready ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleReset()}
                style={inputStyle}
              />
            </div>

            {error && <p style={{ fontSize: 12, color: '#e07a7a', fontFamily: 'monospace', margin: 0 }}>{error}</p>}
            {message && <p style={{ fontSize: 12, color: '#7db87d', fontFamily: 'monospace', margin: 0 }}>{message}</p>}

            <button
              onClick={handleReset}
              disabled={loading}
              style={{
                padding: '12px', background: '#c8a96e', color: '#0a0a0b',
                border: 'none', borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? '...' : 'Update password'}
            </button>
          </>
        ) : (
          // Waiting for Supabase to fire PASSWORD_RECOVERY event
          <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(240,236,227,0.3)' }}>
            Checking link...
          </div>
        )}

      </div>
    </div>
  )
}

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '10px 12px',
  color: '#f0ece3', fontSize: 13,
  fontFamily: 'inherit', outline: 'none',
  width: '100%', boxSizing: 'border-box',
}

export default ResetPasswordPage