import { useParams, useNavigate } from 'react-router-dom'
import { movements } from '../data/movements'
import TrainerRoom from './TrainerRoom'

function MovementPage({ playChord, playNote }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const movement = movements.find(m => m.id === id)

  if (!movement) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'rgba(240,236,227,0.4)', fontFamily: 'monospace' }}>
        Movement not found.{' '}
        <span
          onClick={() => navigate('/')}
          style={{ color: '#c8a96e', cursor: 'pointer' }}
        >
          Go back
        </span>
      </div>
    )
  }

  return (
    <TrainerRoom
      movement={movement}
      onBack={() => navigate('/')}
      playChord={playChord}
      playNote={playNote}
    />
  )
}

export default MovementPage