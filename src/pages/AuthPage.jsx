import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthPage() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError(null)
    setMessage(null)
    setLoading(true)

    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) setError(error.message)
      else navigate('/')
    } else {
      const { error } = await signUp(email, password)
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account.')
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 52px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 380,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}>

        {/* Header */}
        <div>
          <p style={{
            fontFamily: 'monospace', fontSize: 10,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#c8a96e', marginBottom: 8,
          }}>
            Gospel Piano Trainer
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(240,236,227,0.4)' }}>
            {mode === 'signin'
              ? 'Sign in to your Movement account.'
              : 'Start learning gospel piano today.'}
          </p>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={inputStyle}
          />
        </div>

        {/* Error / success */}
        {error && (
          <p style={{ fontSize: 12, color: '#e07a7a', fontFamily: 'monospace', margin: 0 }}>
            {error}
          </p>
        )}
        {message && (
          <p style={{ fontSize: 12, color: '#7db87d', fontFamily: 'monospace', margin: 0 }}>
            {message}
          </p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            padding: '12px',
            background: '#c8a96e',
            color: '#0a0a0b',
            border: 'none',
            borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: 13,
            fontWeight: 700,
            fontFamily: 'inherit',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {loading ? '...' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        {/* Toggle */}
        <p style={{ fontSize: 12, color: 'rgba(240,236,227,0.35)', textAlign: 'center', margin: 0 }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMessage(null) }}
            style={{ color: '#c8a96e', cursor: 'pointer' }}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </span>
        </p>

        {/* Back */}
        <p
          onClick={() => navigate('/')}
          style={{
            fontSize: 12, color: 'rgba(240,236,227,0.25)',
            textAlign: 'center', cursor: 'pointer',
            margin: 0, transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(240,236,227,0.6)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,236,236,0.25)'}
        >
          ← Back to library
        </p>

      </div>
    </div>
  )
}

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '0.5px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '10px 12px',
  color: '#f0ece3',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

export default AuthPage