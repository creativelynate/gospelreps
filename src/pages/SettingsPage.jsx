import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useProfile } from '../hooks/useProfile'

function SettingsPage() {
    const { user, signOut } = useAuth()
    const navigate = useNavigate()
    const { profile, loading, updateDisplayName } = useProfile()

    const [displayName, setDisplayName] = useState(user?.user_metadata?.display_name ?? '')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [profileMsg, setProfileMsg] = useState(null)
    const [profileErr, setProfileErr] = useState(null)
    const [passwordMsg, setPasswordMsg] = useState(null)
    const [passwordErr, setPasswordErr] = useState(null)
    const [profileLoading, setProfileLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    // Populate field once profile loads
    useEffect(() => {
        if (profile) setDisplayName(profile.display_name ?? '')
    }, [profile])

    async function handleSaveProfile() {
        setProfileMsg(null)
        setProfileErr(null)
        setProfileLoading(true)

        const { error } = await updateDisplayName(displayName)
        if (error) setProfileErr(typeof error === 'string' ? error : error.message)
        else setProfileMsg('Profile updated.')

        setProfileLoading(false)
    }

    async function handleChangePassword() {
        setPasswordMsg(null)
        setPasswordErr(null)

        if (newPassword !== confirmPassword) {
            setPasswordErr('Passwords do not match.')
            return
        }
        if (newPassword.length < 6) {
            setPasswordErr('Password must be at least 6 characters.')
            return
        }

        setPasswordLoading(true)
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) setPasswordErr(error.message)
        else {
            setPasswordMsg('Password updated.')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        }
        setPasswordLoading(false)
    }

    async function handleSignOut() {
        await signOut()
        navigate('/')
    }

    if (!user) {
        navigate('/auth')
        return null
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 560, margin: '0 auto' }}>

            {/* Back */}
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'transparent', border: 'none',
                    color: 'rgba(240,236,227,0.4)', fontSize: 13,
                    cursor: 'pointer', padding: 0, marginBottom: '2rem',
                    display: 'flex', alignItems: 'center', gap: 6,
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#f0ece3'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,236,227,0.4)'}
            >
                ← Back
            </button>

            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <p style={{
                    fontFamily: 'monospace', fontSize: 10,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: '#c8a96e', marginBottom: 6,
                }}>
                    Account
                </p>
                <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Settings</h1>
                <p style={{ fontSize: 13, color: 'rgba(240,236,227,0.4)' }}>{user.email}</p>
            </div>

            {/* Profile section */}
            <Section title="Profile">
                <Field label="Display name">
                    <input
                        type="text"
                        placeholder="Your name"
                        value={displayName}
                        onChange={e => setDisplayName(e.target.value)}
                        style={inputStyle}
                    />
                </Field>
                {profileErr && <Feedback type="error">{profileErr}</Feedback>}
                {profileMsg && <Feedback type="success">{profileMsg}</Feedback>}
                <SaveButton onClick={handleSaveProfile} loading={profileLoading}>
                    Save profile
                </SaveButton>
            </Section>

            <Divider />

            {/* Password section */}
            <Section title="Change password">
                <Field label="New password">
                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        style={inputStyle}
                    />
                </Field>
                <Field label="Confirm password">
                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        style={inputStyle}
                    />
                </Field>
                {passwordErr && <Feedback type="error">{passwordErr}</Feedback>}
                {passwordMsg && <Feedback type="success">{passwordMsg}</Feedback>}
                <SaveButton onClick={handleChangePassword} loading={passwordLoading}>
                    Update password
                </SaveButton>
            </Section>

            <Divider />

            {/* Sign out */}
            <Section title="Session">
                <p style={{ fontSize: 13, color: 'rgba(240,236,227,0.4)', marginBottom: 16 }}>
                    You are signed in as <span style={{ color: '#f0ece3' }}>{user.email}</span>.
                </p>
                <button
                    onClick={handleSignOut}
                    style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        color: '#e07a7a',
                        border: '0.5px solid rgba(224,122,122,0.3)',
                        borderRadius: 8, cursor: 'pointer',
                        fontSize: 13, fontWeight: 600,
                        fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(224,122,122,0.08)'
                        e.currentTarget.style.borderColor = 'rgba(224,122,122,0.5)'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.borderColor = 'rgba(224,122,122,0.3)'
                    }}
                >
                    Sign out
                </button>
            </Section>

        </div>
    )
}

// Small reusable sub-components

function Section({ title, children }) {
    return (
        <div style={{ marginBottom: '2rem' }}>
            <p style={{
                fontFamily: 'monospace', fontSize: 10,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'rgba(240,236,227,0.3)', marginBottom: 16,
            }}>
                {title}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {children}
            </div>
        </div>
    )
}

function Field({ label, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, color: 'rgba(240,236,227,0.4)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                {label}
            </label>
            {children}
        </div>
    )
}

function Feedback({ type, children }) {
    return (
        <p style={{
            fontSize: 12, fontFamily: 'monospace', margin: 0,
            color: type === 'error' ? '#e07a7a' : '#7db87d',
        }}>
            {children}
        </p>
    )
}

function SaveButton({ onClick, loading, children }) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            style={{
                padding: '10px 20px',
                background: '#c8a96e',
                color: '#0a0a0b',
                border: 'none', borderRadius: 8,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 13, fontWeight: 700,
                fontFamily: 'inherit',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.15s',
                alignSelf: 'flex-start',
            }}
        >
            {loading ? '...' : children}
        </button>
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

function Divider() {
    return <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: '2rem' }} />
}

export default SettingsPage