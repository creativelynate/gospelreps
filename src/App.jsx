import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MovementPage from './pages/MovementPage'
import Navbar from './components/Navbar'
import { useAudio, SOUND_PRESETS, DEFAULT_PRESET } from './hooks/useAudio'
import { Analytics } from '@vercel/analytics/react'
import { movements } from './data/movements'

function App() {
  const [preset, setPreset] = useState(DEFAULT_PRESET)
  const { playChord, playNote } = useAudio(preset)

  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={
          <HomePage movements={movements} preset={preset} setPreset={setPreset} />
        } />
        <Route path="/movements/:id" element={
          <MovementPage playChord={playChord} playNote={playNote} preset={preset} setPreset={setPreset} />
        } />
      </Routes>
      <Analytics />
    </>
  )
}

export default App