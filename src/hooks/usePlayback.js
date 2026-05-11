import { useRef, useState } from 'react'

export function usePlayback({
  resolvedChords,
  resolvedMelody,
  resolvedBassLine,
  getInversionForChord,
  invertChord,
  playChord,
  playNote,
  onStep,
  onMelodyStep,
  onBassStep,
  onStop,
  beatsPerChord = 2,
}) {
  const [isPlaying, setIsPlaying]     = useState(false)
  const [currentStep, setCurrentStep] = useState(null)
  const timeoutsRef       = useRef([])
  const activeMelodyRef   = useRef(null)
  const activeBassRef     = useRef(null)

  function stop() {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    activeMelodyRef.current = null
    activeBassRef.current = null
    setIsPlaying(false)
    setCurrentStep(null)
    onStop?.()
  }

  function scheduleNoteSequence({ notes, activeRef, onStep: onStepCb, playFn, msPerBeat }) {
    notes.forEach((n, idx) => {
      const token = `${n.id}-${idx}`
      const t = setTimeout(() => {
        activeRef.current = token
        onStepCb?.(n)
        playFn(n.note, n.octave)

        const clearT = setTimeout(() => {
          if (activeRef.current === token) {
            activeRef.current = null
            onStepCb?.(null)
          }
        }, n.duration * msPerBeat)
        timeoutsRef.current.push(clearT)
      }, n.beat * msPerBeat)
      timeoutsRef.current.push(t)
    })
  }

  function play(bpm = 60) {
  if (isPlaying) { stop(); return }

  const msPerBeat  = (60 / bpm) * 1000
  const msPerChord = msPerBeat * beatsPerChord

  setIsPlaying(true)

  let prevNotes = []

  // Determine total duration from all events
  const chordBeats = resolvedChords.map((chord, i) =>
    chord.beat != null ? chord.beat : i * beatsPerChord
  )

  // Schedule chords by beat
  resolvedChords.forEach((chord, i) => {
    const beatOffset = chord.beat != null ? chord.beat : i * beatsPerChord
    const ms = beatOffset * msPerBeat

    const t = setTimeout(() => {
      const inv      = getInversionForChord(i)
      const inverted = invertChord(chord.notes, inv)

      setCurrentStep(i)
      onStep?.(i, inverted)

      const newNotes = inverted.filter(n => !prevNotes.includes(n))
      if (newNotes.length > 0) playChord(newNotes)
      prevNotes = inverted
    }, ms)
    timeoutsRef.current.push(t)
  })

  // End timer: find the last event across chords, melody, bass
  const lastChordBeat = Math.max(...chordBeats) + beatsPerChord
  const allSequences  = [...resolvedMelody, ...(resolvedBassLine ?? [])]
  const sequenceEnd   = allSequences.length > 0
    ? Math.max(...allSequences.map(m => m.beat + m.duration))
    : 0
  const totalMs = Math.max(lastChordBeat, sequenceEnd) * msPerBeat

  const endT = setTimeout(() => {
    setIsPlaying(false)
    setCurrentStep(null)
    onStop?.()
  }, totalMs)
  timeoutsRef.current.push(endT)

  // Schedule melody and bass (unchanged)
  scheduleNoteSequence({
    notes: resolvedMelody,
    activeRef: activeMelodyRef,
    onStep: onMelodyStep,
    playFn: playNote,
    msPerBeat,
  })

  scheduleNoteSequence({
    notes: resolvedBassLine ?? [],
    activeRef: activeBassRef,
    onStep: onBassStep,
    playFn: playNote,
    msPerBeat,
  })
}

  return { isPlaying, currentStep, play, stop }
}