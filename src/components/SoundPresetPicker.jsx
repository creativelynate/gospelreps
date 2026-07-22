import { SOUND_PRESETS } from '../hooks/useAudio'

function SoundPresetPicker({ preset, setPreset }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'rgba(240,236,227,0.3)',
      }}>
        Sound
      </span>
      {Object.entries(SOUND_PRESETS).map(([key, p]) => (
        <button
          key={key}
          onClick={() => setPreset(key)}
          style={{
            padding: '5px 12px',
            background: preset === key ? 'rgba(200,169,110,0.15)' : 'transparent',
            color: preset === key ? '#c8a96e' : 'rgba(240,236,227,0.35)',
            border: '0.5px solid',
            borderColor: preset === key ? 'rgba(200,169,110,0.4)' : 'rgba(255,255,255,0.06)',
            borderRadius: 4, cursor: 'pointer', fontSize: 11,
            fontFamily: 'monospace', letterSpacing: '0.08em',
            transition: 'all 0.15s',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

export default SoundPresetPicker