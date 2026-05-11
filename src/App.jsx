import { Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import MovementPage from './components/MovementPage'
import { useAudio } from './hooks/useAudio'
import { Analytics } from '@vercel/analytics/react'
import { movements } from './data/movements'

function App() {
  const { playChord, playNote } = useAudio()

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage movements={movements} />} />
        <Route
          path="/movements/:id"
          element={<MovementPage playChord={playChord} playNote={playNote} />}
        />
      </Routes>
      <Analytics />
    </>
  )
}

export default App