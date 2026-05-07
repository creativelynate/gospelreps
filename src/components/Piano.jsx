const WHITE_KEY_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BLACK_KEY_MAP   = { C: 'C#', D: 'D#', F: 'F#', G: 'G#', A: 'A#' }

const KEY_WIDTH    = 40
const KEY_GAP      = 2
const WHITE_HEIGHT = 130
const BLACK_HEIGHT = 82
const BLACK_WIDTH  = 26

function buildKeys(octaves) {
  const whites = []
  const blacks = []

  octaves.forEach(oct => {
    WHITE_KEY_NAMES.forEach(note => {
      whites.push({ note, octave: oct, id: `${note}${oct}` })
      const blackNote = BLACK_KEY_MAP[note]
      if (blackNote) {
        blacks.push({ note: blackNote, octave: oct, id: `${blackNote}${oct}`, whiteIndex: whites.length - 1 })
      } else {
        blacks.push(null)
      }
    })
  })

  return { whites, blacks }
}

function Piano({ activeNotes = [], melodyNote = null, onNoteClick, octaves = [3, 4] }) {
  const { whites, blacks } = buildKeys(octaves)
  const activeSet  = new Set(activeNotes)
  const melodySet  = new Set(melodyNote ? [melodyNote] : [])

  function getWhiteKeyBg(id) {
    if (melodySet.has(id)) return '#e8a838'   // amber — melody
    if (activeSet.has(id)) return '#c8a96e'   // gold  — chord
    return '#f5f0e8'
  }

  function getBlackKeyBg(id) {
    if (melodySet.has(id)) return '#b07820'   // dark amber — melody on black
    if (activeSet.has(id)) return '#c8a96e'   // gold — chord
    return '#1a1a1c'
  }

  function getLabelColor(id) {
    if (melodySet.has(id) || activeSet.has(id)) return '#0e0e0f'
    return 'rgba(0,0,0,0.25)'
  }

  return (
    <div style={{ position: 'relative', display: 'inline-flex', userSelect: 'none' }}>

      {/* White keys */}
      <div style={{ display: 'flex', gap: KEY_GAP }}>
        {whites.map(({ note, octave, id }) => (
          <div
            key={id}
            onClick={() => onNoteClick?.(note, octave)}
            style={{
              width: KEY_WIDTH,
              height: WHITE_HEIGHT,
              background: getWhiteKeyBg(id),
              borderRadius: '0 0 6px 6px',
              border: '0.5px solid #ccc',
              cursor: 'pointer',
              transition: 'background 0.1s',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 6,
              boxSizing: 'border-box',
              position: 'relative',
            }}
          >
            {/* Melody dot indicator */}
            {melodySet.has(id) && (
              <div style={{
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#0e0e0f',
                opacity: 0.5,
              }} />
            )}
            {note === 'C' && (
              <span style={{
                fontSize: 10,
                fontFamily: 'monospace',
                color: getLabelColor(id),
                pointerEvents: 'none',
              }}>
                C{octave}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Black keys */}
      <div style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {blacks.map((key) => {
          if (!key) return null
          const { note, octave, id, whiteIndex } = key
          const left = whiteIndex * (KEY_WIDTH + KEY_GAP) + KEY_WIDTH - (BLACK_WIDTH / 2) - 2
          return (
            <div
              key={id}
              onClick={() => onNoteClick?.(note, octave)}
              style={{
                position: 'absolute',
                left,
                top: 0,
                width: BLACK_WIDTH,
                height: BLACK_HEIGHT,
                background: getBlackKeyBg(id),
                borderRadius: '0 0 4px 4px',
                border: '0.5px solid rgba(255,255,255,0.1)',
                zIndex: 2,
                cursor: 'pointer',
                pointerEvents: 'all',
                transition: 'background 0.1s',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {/* Melody dot on black key */}
              {melodySet.has(id) && (
                <div style={{
                  marginTop: 8,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.6)',
                }} />
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default Piano