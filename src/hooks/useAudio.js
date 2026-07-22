import { useEffect, useRef } from 'react'
import * as Tone from 'tone'

export const SOUND_PRESETS = {
  soft: {
    label: 'Soft',
    reverb:   { decay: 4.0, wet: 0.5 },
    envelope: { attack: 0.08, decay: 0.3, sustain: 0.6, release: 2.5 },
    filter:   { frequency: 3500, type: 'lowpass' },
    volume:   -4,
  },
  warm: {
    label: 'Warm',
    reverb:   { decay: 3.0, wet: 0.4 },
    envelope: { attack: 0.04, decay: 0.2, sustain: 0.7, release: 2.0 },
    filter:   { frequency: 5000, type: 'lowpass' },
    volume:   -2,
  },
  bright: {
    label: 'Bright',
    reverb:   { decay: 2.5, wet: 0.3 },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.8, release: 1.5 },
    filter:   { frequency: 12000, type: 'lowpass' },
    volume:   0,
  },
  hall: {
    label: 'Hall',
    reverb:   { decay: 6.0, wet: 0.6 },
    envelope: { attack: 0.06, decay: 0.4, sustain: 0.5, release: 3.5 },
    filter:   { frequency: 4000, type: 'lowpass' },
    volume:   -6,
  },
}

export const DEFAULT_PRESET = 'soft'

export function useAudio(presetKey = DEFAULT_PRESET) {
  const samplerRef  = useRef(null)
  const reverbRef   = useRef(null)
  const filterRef   = useRef(null)
  const loadedRef   = useRef(false)

  useEffect(() => {
    const preset = SOUND_PRESETS[presetKey] ?? SOUND_PRESETS[DEFAULT_PRESET]

    const reverb = new Tone.Reverb({ decay: preset.reverb.decay, wet: preset.reverb.wet })
    const filter = new Tone.Filter({ frequency: preset.filter.frequency, type: preset.filter.type })
    const vol    = new Tone.Volume(preset.volume).toDestination()

    reverb.connect(vol)
    filter.connect(reverb)

    reverbRef.current = reverb
    filterRef.current = filter

    samplerRef.current = new Tone.Sampler({
      urls: {
        A0: 'A0.mp3', C1: 'C1.mp3',
        'D#1': 'Ds1.mp3', 'F#1': 'Fs1.mp3',
        A1: 'A1.mp3', C2: 'C2.mp3',
        'D#2': 'Ds2.mp3', 'F#2': 'Fs2.mp3',
        A2: 'A2.mp3', C3: 'C3.mp3',
        'D#3': 'Ds3.mp3', 'F#3': 'Fs3.mp3',
        A3: 'A3.mp3', C4: 'C4.mp3',
        'D#4': 'Ds4.mp3', 'F#4': 'Fs4.mp3',
        A4: 'A4.mp3', C5: 'C5.mp3',
        'D#5': 'Ds5.mp3', 'F#5': 'Fs5.mp3',
        A5: 'A5.mp3', C6: 'C6.mp3',
        'D#6': 'Ds6.mp3', 'F#6': 'Fs6.mp3',
        A6: 'A6.mp3', C7: 'C7.mp3',
        'D#7': 'Ds7.mp3', 'F#7': 'Fs7.mp3',
        A7: 'A7.mp3', C8: 'C8.mp3',
      },
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      onload: () => { loadedRef.current = true },
    }).connect(filter)

    return () => {
      samplerRef.current?.dispose()
      reverb.dispose()
      filter.dispose()
      vol.dispose()
    }
  }, [presetKey]) // reinitializes when preset changes

  function playChord(notes) {
    if (!loadedRef.current) return
    samplerRef.current?.triggerAttackRelease(notes, '2n')
  }

  function playNote(note, octave = 4) {
    if (!loadedRef.current) return
    samplerRef.current?.triggerAttackRelease(`${note}${octave}`, '2n')
  }

  return { playChord, playNote }
}