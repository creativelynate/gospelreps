import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

function AuthPage() {
    const { signIn, signUp } = useAuth()
    const navigate = useNavigate()
    const [mode, setMode] = useState('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [acceptedTerms, setAcceptedTerms] = useState(false)
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const [forgotMode, setForgotMode] = useState(false)

    async function handleForgotPassword() {
        setError(null)
        setMessage(null)
        if (!email) { setError('Enter your email above first.'); return }
        setLoading(true)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) setError(error.message)
        else setMessage('Check your email for a reset link.')
        setLoading(false)
    }

    async function handleSubmit() {
        setError(null)
        setMessage(null)

        if (mode === 'signup' && !acceptedTerms) {
            setError('You must accept the terms and conditions.')
            return
        }

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
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 24 }}>

                <div>
                    <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c8a96e', marginBottom: 8 }}>
                        Gospel Piano Trainer
                    </p>
                    <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
                        {mode === 'signin' ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p style={{ fontSize: 13, color: 'rgba(240,236,227,0.4)' }}>
                        {mode === 'signin' ? 'Sign in to your Movement account.' : 'Start learning gospel piano today.'}
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} style={inputStyle} />
                </div>

                {/* Terms — signup only */}
                {mode === 'signup' && (
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={e => setAcceptedTerms(e.target.checked)}
                            style={{ marginTop: 2, accentColor: '#c8a96e', flexShrink: 0 }}
                        />
                        <span style={{ fontSize: 12, color: 'rgba(240,236,227,0.4)', lineHeight: 1.5 }}>
                            I agree to the{' '}
                            <Link to="/terms" target="_blank" style={{ color: '#c8a96e', textDecoration: 'none' }}>
                                Terms & Conditions
                            </Link>
                        </span>
                    </label>
                )}

                {/* Forgot password — signin only */}
                {mode === 'signin' && (
                    <p
                        onClick={handleForgotPassword}
                        style={{ fontSize: 12, color: 'rgba(240,236,227,0.3)', margin: 0, cursor: 'pointer', transition: 'color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#c8a96e'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,236,227,0.3)'}
                    >
                        Forgot password?
                    </p>
                )}

                {error && <p style={{ fontSize: 12, color: '#e07a7a', fontFamily: 'monospace', margin: 0 }}>{error}</p>}
                {message && <p style={{ fontSize: 12, color: '#7db87d', fontFamily: 'monospace', margin: 0 }}>{message}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ padding: '12px', background: '#c8a96e', color: '#0a0a0b', border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? '...' : mode === 'signin' ? 'Sign in' : 'Create account'}
                </button>

                <p style={{ fontSize: 12, color: 'rgba(240,236,227,0.35)', textAlign: 'center', margin: 0 }}>
                    {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                    <span
                        onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setMessage(null); setAcceptedTerms(false) }}
                        style={{ color: '#c8a96e', cursor: 'pointer' }}
                    >
                        {mode === 'signin' ? 'Sign up' : 'Sign in'}
                    </span>
                </p>

                <p onClick={() => navigate('/')} style={{ fontSize: 12, color: 'rgba(240,236,227,0.25)', textAlign: 'center', cursor: 'pointer', margin: 0, transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(240,236,227,0.6)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,236,227,0.25)'}
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
    borderRadius: 8, padding: '10px 12px',
    color: '#f0ece3', fontSize: 13,
    fontFamily: 'inherit', outline: 'none',
    width: '100%', boxSizing: 'border-box',
}

export default AuthPage