import { useState } from 'react'
import Piano from './Piano'
import { resolveMovement, resolveMelody, invertChord, getInversionLabel, stripOctave, buildChordName } from '../utils/transpose'
import { ALL_KEYS } from '../data/movements'
import { usePlayback } from '../hooks/usePlayback'

function TrainerRoom({ movement, onBack, playChord, playNote }) {
  const [selectedKey, setSelectedKey] = useState(movement.defaultKey)
  const [activeChordIndex, setActiveChordIndex] = useState(null)
  const [activeNotes, setActiveNotes] = useState([])
  const [activeBassNote, setActiveBassNote] = useState(null)
  const [activeMelodyNote, setActiveMelodyNote] = useState(null) // { note, octave, id }
  const [showMelody, setShowMelody] = useState(true)
  const [bpm, setBpm] = useState(movement.defaultBpm ?? 120)

  const resolvedChords = resolveMovement(movement, selectedKey)
  const resolvedMelodyNotes = resolveMelody(movement, selectedKey)
  const hasLeftHand = resolvedChords.some(c => c.leftHandNote)
  const hasMelody = resolvedMelodyNotes.length > 0
  const beatsPerChord = movement.beatsPerChord ?? 2

  function getInversionForChord(i) {
    return resolvedChords[i]?.inversion ?? 0
  }

  const { isPlaying, currentStep, play, stop } = usePlayback({
    resolvedChords,
    resolvedMelody: showMelody ? resolvedMelodyNotes : [],
    getInversionForChord,
    invertChord,
    playChord,
    playNote,
    beatsPerChord,
    onStep: (i, inverted, leftHandNote) => {
      setActiveChordIndex(i)
      setActiveNotes(inverted)
      setActiveBassNote(leftHandNote ?? null)
    },
    onMelodyStep: (melodyNote) => {
      setActiveMelodyNote(melodyNote ?? null)
    },
    onStop: () => {
      setActiveChordIndex(null)
      setActiveNotes([])
      setActiveBassNote(null)
      setActiveMelodyNote(null)
    },
  })

  function handleChordClick(chord, index) {
    if (isPlaying) stop()
    const inv = getInversionForChord(index)
    const inverted = invertChord(chord.notes, inv)
    setActiveChordIndex(index)
    setActiveNotes(inverted)
    setActiveMelodyNote(null)
    playChord(inverted)
    if (chord.leftHandNote) {
      const note = chord.leftHandNote.slice(0, -1)
      const octave = parseInt(chord.leftHandNote.slice(-1))
      setActiveBassNote(chord.leftHandNote)
      playNote(note, octave)
    } else {
      setActiveBassNote(null)
    }
  }

  function handleInversionChange(chordIndex, inv) {
    setChordInversions(prev => ({ ...prev, [chordIndex]: inv }))
    if (activeChordIndex === chordIndex) {
      const inverted = invertChord(resolvedChords[chordIndex].notes, inv)
      setActiveNotes(inverted)
      playChord(inverted)
      const lhn = resolvedChords[chordIndex].leftHandNote
      if (lhn) playNote(lhn.slice(0, -1), parseInt(lhn.slice(-1)))
    }
  }

  function handleNoteClick(note, octave) {
    if (isPlaying) stop()
    const id = `${note}${octave}`
    setActiveChordIndex(null)
    setActiveNotes([id])
    setActiveBassNote(null)
    setActiveMelodyNote(null)
    playNote(note, octave)
  }

  function handleKeyChange(key) {
    if (isPlaying) stop()
    setSelectedKey(key)
    setActiveNotes([])
    setActiveChordIndex(null)
    setActiveBassNote(null)
    setActiveMelodyNote(null)
  }

  // The melody note id to highlight on the right-hand piano
  const melodyHighlightId = activeMelodyNote?.id ?? null

  return (
    <div style={{ padding: '2rem', maxWidth: 1560, margin: '0 auto' }}>

      {/* Back */}
      <button
        onClick={onBack}
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

      {/* Title + Key selector */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(240,236,227,0.35)', marginBottom: 6 }}>
            Now practicing
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 700 }}>{movement.name}</h2>
          <p style={{ marginTop: 6, color: 'rgba(240,236,227,0.4)', fontSize: 14 }}>
            {movement.description}
          </p>
        </div>

        <div>
          <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,236,227,0.3)', marginBottom: 8 }}>
            Key
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 220 }}>
            {ALL_KEYS.map(key => (
              <button
                key={key}
                onClick={() => handleKeyChange(key)}
                style={{
                  width: 36, height: 36,
                  background: selectedKey === key ? '#c8a96e' : '#161618',
                  color: selectedKey === key ? '#0e0e0f' : 'rgba(240,236,227,0.6)',
                  border: '0.5px solid',
                  borderColor: selectedKey === key ? '#c8a96e' : 'rgba(255,255,255,0.08)',
                  borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Piano row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginBottom: '2.5rem', overflowX: 'auto' }}>
        {hasLeftHand && (
          <div style={{ flexShrink: 0 }}>
            <p style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,236,227,0.25)', marginBottom: 6, textAlign: 'center' }}>
              Left
            </p>
            <Piano
              activeNotes={activeBassNote ? [activeBassNote] : []}
              onNoteClick={(note, octave) => { setActiveBassNote(`${note}${octave}`); playNote(note, octave) }}
              octaves={[2]}
            />
          </div>
        )}
        {hasLeftHand && (
          <div style={{ width: 1, height: 130, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
        )}

        {/* Right hand piano — shows both chord notes and melody note */}
        <div style={{ flexShrink: 0 }}>
          {hasLeftHand && (
            <p style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,236,227,0.25)', marginBottom: 6, textAlign: 'center' }}>
              Right
            </p>
          )}

          {/* Melody note badge above piano */}
          {hasMelody && showMelody && (
            <div style={{ marginBottom: 8, minHeight: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              {activeMelodyNote ? (
                <>
                  <div style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '0.5px solid rgba(255,255,255,0.25)',
                    borderRadius: 4,
                    padding: '3px 10px',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#f0ece3',
                    letterSpacing: '0.05em',
                  }}>
                    {activeMelodyNote.note}{activeMelodyNote.octave}
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(240,236,227,0.3)' }}>
                    melody
                  </span>
                </>
              ) : (
                <div style={{ height: 24 }} />
              )}
            </div>
          )}

          <Piano
            activeNotes={activeNotes}
            melodyNote={showMelody ? melodyHighlightId : null}
            onNoteClick={handleNoteClick}
            octaves={[3, 4, 5]}
          />
        </div>
      </div>

      {/* Play controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => isPlaying ? stop() : play(bpm)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px',
            background: isPlaying ? 'rgba(200,169,110,0.12)' : '#c8a96e',
            color: isPlaying ? '#c8a96e' : '#0e0e0f',
            border: '0.5px solid',
            borderColor: isPlaying ? 'rgba(200,169,110,0.4)' : '#c8a96e',
            borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 700,
            transition: 'all 0.15s', letterSpacing: '0.05em',
          }}
        >
          {isPlaying ? '■ Stop' : '▶ Play'}
        </button>

        {/* BPM control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            type="range"
            min={40} max={160} step={1}
            value={bpm}
            onChange={e => setBpm(Number(e.target.value))}
            style={{ width: 100, accentColor: '#c8a96e' }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(240,236,227,0.4)', minWidth: 52 }}>
            {bpm} bpm
          </span>
        </div>

        {/* Melody toggle */}
        {hasMelody && (
          <button
            onClick={() => setShowMelody(v => !v)}
            style={{
              padding: '10px 16px',
              background: showMelody ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: showMelody ? '#f0ece3' : 'rgba(240,236,227,0.3)',
              border: '0.5px solid',
              borderColor: showMelody ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
              borderRadius: 6, cursor: 'pointer', fontSize: 12,
              fontFamily: 'monospace', letterSpacing: '0.08em',
              transition: 'all 0.15s',
            }}
          >
            {showMelody ? '♪ Melody on' : '♪ Melody off'}
          </button>
        )}
      </div>

      {/* Chord steps */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,236,227,0.3)', marginBottom: 12 }}>
          Chords — click to play
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {resolvedChords.map((chord, i) => {
            const inv = getInversionForChord(i)
            const inverted = invertChord(chord.notes, inv)
            const isActive = activeChordIndex === i
            const availableInversions = chord.inversions ?? []

            return (
              <div key={i} style={{ flex: 1, minWidth: 100, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  onClick={() => handleChordClick(chord, i)}
                  style={{
                    width: '100%',
                    padding: '16px 12px',
                    background: isActive ? '#c8a96e' : '#161618',
                    color: isActive ? '#0e0e0f' : '#f0ece3',
                    border: '0.5px solid',
                    borderColor: isActive ? '#c8a96e' : 'rgba(255,255,255,0.08)',
                    borderRadius: 6, cursor: 'pointer', fontSize: 18, fontWeight: 700, transition: 'all 0.15s',
                  }}
                >
                  {buildChordName(chord, selectedKey)}
                  <div style={{ fontSize: 11, fontWeight: 400, marginTop: 4, opacity: 0.6, fontFamily: 'monospace' }}>
                    {inverted.map(stripOctave).join(' ')}
                  </div>
                  {chord.leftHandNote && (
                    <div style={{ fontSize: 10, fontWeight: 400, marginTop: 2, opacity: 0.4, fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                      /{stripOctave(chord.leftHandNote)}
                    </div>
                  )}
                </button>

                {availableInversions.length > 0 && (
                  <div style={{ display: 'flex', gap: 4 }}>
                    {availableInversions.map(invOption => (
                      <button
                        key={invOption}
                        onClick={() => handleInversionChange(i, invOption)}
                        style={{
                          flex: 1,
                          padding: '4px 0',
                          background: inv === invOption ? 'rgba(200,169,110,0.15)' : 'transparent',
                          color: inv === invOption ? '#c8a96e' : 'rgba(240,236,227,0.3)',
                          border: '0.5px solid',
                          borderColor: inv === invOption ? 'rgba(200,169,110,0.4)' : 'rgba(255,255,255,0.06)',
                          borderRadius: 3, cursor: 'pointer', fontSize: 10,
                          fontFamily: 'monospace', transition: 'all 0.15s',
                        }}
                      >
                        {getInversionLabel(invOption)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Melody steps readout */}
      {hasMelody && showMelody && (
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,236,227,0.3)', marginBottom: 10 }}>
            Melody
          </p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {resolvedMelodyNotes.map((m, i) => {
              const isActiveM = activeMelodyNote?.id === m.id && activeMelodyNote?.beat === m.beat
              const durationLabel = m.duration === 0.5 ? '⅛' : m.duration === 1 ? '♩' : m.duration === 2 ? '𝅗𝅥' : '𝅝'
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                    padding: '8px 10px',
                    background: isActiveM ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: '0.5px solid',
                    borderColor: isActiveM ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                    borderRadius: 4,
                    transition: 'all 0.1s',
                    minWidth: 36,
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: isActiveM ? '#f0ece3' : 'rgba(240,236,227,0.5)' }}>
                    {m.note}
                  </span>
                  <span style={{ fontSize: 14, color: isActiveM ? 'rgba(240,236,227,0.8)' : 'rgba(240,236,227,0.25)' }}>
                    {durationLabel}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(240,236,227,0.2)' }}>
                    b{m.beat + 1}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Active notes readout */}
      {activeChordIndex !== null && (
        <p style={{ marginTop: 4, fontFamily: 'monospace', fontSize: 12, color: 'rgba(240,236,227,0.35)', letterSpacing: '0.1em' }}>
          {getInversionLabel(getInversionForChord(activeChordIndex))}
          {activeBassNote && ` · bass ${stripOctave(activeBassNote)}`}
          {' — '}
          {invertChord(resolvedChords[activeChordIndex].notes, getInversionForChord(activeChordIndex)).join(' – ')}
        </p>
      )}

    </div>
  )
}

export default TrainerRoom