import { useState } from 'react'
import HomePage from './components/HomePage'
import TrainerRoom from './components/TrainerRoom'
import { useAudio } from './hooks/useAudio'
import { movements } from './data/movements'
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [currentRoom, setCurrentRoom] = useState(null)
  const { playChord, playNote } = useAudio()

  if (currentRoom) {
    return (
      <>
        <TrainerRoom
          movement={currentRoom}
          onBack={() => setCurrentRoom(null)}
          playChord={playChord}
          playNote={playNote}
        />
        <Analytics />
      </>
    ) 
  }

  return (
    <>
      <HomePage
        movements={movements}
        onSelect={(m) => setCurrentRoom(m)}
      />
      <Analytics />
    </>
  )
}

export default App