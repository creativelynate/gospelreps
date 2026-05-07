import { useRef, useState } from 'react'

export function usePlayback({
  resolvedChords,
  resolvedMelody,
  getInversionForChord,
  invertChord,
  playChord,
  playNote,
  onStep,
  onMelodyStep,
  onStop,
  beatsPerChord = 2,
}) {
  const [isPlaying, setIsPlaying]     = useState(false)
  const [currentStep, setCurrentStep] = useState(null)
  const timeoutsRef        = useRef([])
  const activeMelodyIdRef  = useRef(null)   // ← tracks which note is currently active

  function stop() {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    activeMelodyIdRef.current = null
    setIsPlaying(false)
    setCurrentStep(null)
    onStop?.()
  }

  function play(bpm = 60 ) { //HERE (i want to add "default bpm" to movments)
    if (isPlaying) { stop(); return }

    const msPerBeat  = (60 / bpm) * 1000
    const msPerChord =  msPerBeat * beatsPerChord

    setIsPlaying(true)

    let prevNotes = []
    let prevBass  = null

    resolvedChords.forEach((chord, i) => {
      const t = setTimeout(() => {
        const inv      = getInversionForChord(i)
        const inverted = invertChord(chord.notes, inv)
        const lhn      = chord.leftHandNote ?? null

        setCurrentStep(i)
        onStep?.(i, inverted, lhn)

        const newNotes = inverted.filter(n => !prevNotes.includes(n))
        if (newNotes.length > 0) playChord(newNotes)

        if (lhn && lhn !== prevBass) {
          playNote(lhn.slice(0, -1), parseInt(lhn.slice(-1)))
        }

        prevNotes = inverted
        prevBass  = lhn

        if (i === resolvedChords.length - 1) {
          const totalBeats = resolvedChords.length * beatsPerChord
          const melodyEnd = resolvedMelody.length > 0
            ? Math.max(...resolvedMelody.map(m => m.beat + m.duration))
            : totalBeats
          const endMs = Math.max(totalBeats, melodyEnd) * msPerBeat

          const endT = setTimeout(() => {
            setIsPlaying(false)
            setCurrentStep(null)
            onStop?.()
          }, msPerChord + (endMs - totalBeats * msPerBeat))
          timeoutsRef.current.push(endT)
        }
      }, i * msPerChord)

      timeoutsRef.current.push(t)
    })

    // Schedule melody notes
    resolvedMelody.forEach((melodyNote, idx) => {
      // Use index-based unique token so same note can appear twice
      const token = `${melodyNote.note}${melodyNote.octave}-${idx}`

      const t = setTimeout(() => {
        activeMelodyIdRef.current = token
        onMelodyStep?.(melodyNote)
        playNote(melodyNote.note, melodyNote.octave)

        const clearT = setTimeout(() => {
          // Only clear if THIS note is still the active one
          if (activeMelodyIdRef.current === token) {
            activeMelodyIdRef.current = null
            onMelodyStep?.(null)
          }
        }, melodyNote.duration * msPerBeat)
        timeoutsRef.current.push(clearT)

      }, melodyNote.beat * msPerBeat)

      timeoutsRef.current.push(t)
    })
  }

  return { isPlaying, currentStep, play, stop }
}