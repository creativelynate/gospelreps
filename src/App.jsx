import { useState } from 'react'
import HomePage from './components/HomePage'
import TrainerRoom from './components/TrainerRoom'
import { useAudio } from './hooks/useAudio'
import { movements } from './data/movements'

function App() {
  const [currentRoom, setCurrentRoom] = useState(null) // null = home
  const { playChord, playNote } = useAudio()

  if (currentRoom) {
    return (
      <TrainerRoom
        movement={currentRoom}
        onBack={() => setCurrentRoom(null)}
        playChord={playChord}
        playNote={playNote}
      />
    )
  }

  return (
    <HomePage
      movements={movements}
      onSelect={(m) => setCurrentRoom(m)}
    />
  )
}

export default App