//Imports
import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useAudio, SOUND_PRESETS, DEFAULT_PRESET } from './hooks/useAudio'
import { Analytics } from '@vercel/analytics/react'
import { movements } from './data/movements'

//Pages
import HomePage from './pages/HomePage'
import MovementPage from './pages/MovementPage'
import AuthPage from './pages/AuthPage'
import SettingsPage from './pages/SettingsPage'

//Components
import Navbar from './components/Navbar'

function App() {

  const location = useLocation()
  const showNav = location.pathname !== '/auth'

  const [preset, setPreset] = useState(DEFAULT_PRESET)
  const { playChord, playNote } = useAudio(preset)

  return (
    <>
    {showNav && <Navbar />}
      <Routes>
        <Route path="/" element={ <HomePage movements={movements} preset={preset} setPreset={setPreset} /> } />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/movements/:id" element={
          <MovementPage playChord={playChord} playNote={playNote} preset={preset} setPreset={setPreset} />
        } />
      </Routes>
      <Analytics />
    </>
  )
}

export default App