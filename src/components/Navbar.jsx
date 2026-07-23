import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../hooks/useProfile'
import AuthModal from './AuthModal'

function Navbar() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { profile } = useProfile()
  const [showModal, setShowModal] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)

  const avatarLetter = profile?.display_name
    ? profile.display_name[0].toUpperCase()
    : user?.email?.[0].toUpperCase()

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(10,10,11,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        padding: '0 1.5rem', height: 52,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>

        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', flexShrink: 0, marginRight: 8 }}>
          <div style={{ width: 26, height: 26, background: '#c8a96e', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#0a0a0b' }}>
            M
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#f0ece3' }}>
            Move<span style={{ color: '#c8a96e' }}>ment</span>
          </span>
        </div>

        <NavLink onClick={() => navigate('/')}>Library</NavLink>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <span style={{ position: 'absolute', left: 10, color: 'rgba(240,236,227,0.3)', fontSize: 13, pointerEvents: 'none' }}>⌕</span>
          <input
            type="text"
            placeholder="Search movements..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              background: searchFocused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
              border: '0.5px solid',
              borderColor: searchFocused ? 'rgba(200,169,110,0.4)' : 'rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '6px 12px 6px 30px',
              color: '#f0ece3', fontSize: 12, fontFamily: 'inherit',
              width: 200, outline: 'none', transition: 'all 0.15s',
            }}
          />
        </div>

        {/* Auth */}
        {user ? (
          <div
            onClick={() => navigate('/settings')}
            style={{
              width: 30, height: 30,
              borderRadius: '50%',
              background: '#c8a96e',
              color: '#0a0a0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {avatarLetter}
          </div>
        ) : (
          // remove: import AuthModal from './AuthModal'
          // remove: const [showModal, setShowModal] = useState(false)

          // change the sign in button:
          <button onClick={() => navigate('/auth')} style={ghostButtonStyle}>
            Sign in
          </button>

          // remove: {showModal && <AuthModal onClose={() => setShowModal(false)} />}
        )}

      </nav>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  )
}

const ghostButtonStyle = {
  padding: '6px 14px',
  background: 'transparent',
  color: 'rgba(240,236,227,0.6)',
  border: '0.5px solid rgba(255,255,255,0.12)',
  borderRadius: 8, cursor: 'pointer',
  fontSize: 12, fontWeight: 600,
  fontFamily: 'inherit', letterSpacing: '0.02em',
  transition: 'all 0.15s', flexShrink: 0, whiteSpace: 'nowrap',
}

function NavLink({ children, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: 'none', padding: '5px 10px', borderRadius: 6,
        cursor: 'pointer', fontSize: 13, fontFamily: 'inherit',
        color: hovered ? '#f0ece3' : 'rgba(240,236,227,0.45)',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

export default Navbar