import { useRef, useState } from 'react'

export function usePlayback({ resolvedChords, getInversionForChord, invertChord, playChord, playNote, onStep, onStop }) {
  const [isPlaying, setIsPlaying]     = useState(false)
  const [currentStep, setCurrentStep] = useState(null)
  const timeoutsRef = useRef([])

  function stop() {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setIsPlaying(false)
    setCurrentStep(null)
    onStop?.()
  }

  function play(bpm = 60) {
    if (isPlaying) { stop(); return }

    const msPerChord = (60 / bpm) * 1000 * 2

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

        // Only play chord notes that weren't in the previous chord
        const newNotes = inverted.filter(n => !prevNotes.includes(n))
        if (newNotes.length > 0) {
          playChord(newNotes)
        }

        // Only play bass if it changed
        if (lhn && lhn !== prevBass) {
          playNote(lhn.slice(0, -1), parseInt(lhn.slice(-1)))
        }

        prevNotes = inverted
        prevBass  = lhn

        if (i === resolvedChords.length - 1) {
          const endT = setTimeout(() => {
            setIsPlaying(false)
            setCurrentStep(null)
            onStop?.()
          }, msPerChord)
          timeoutsRef.current.push(endT)
        }
      }, i * msPerChord)

      timeoutsRef.current.push(t)
    })
  }

  return { isPlaying, currentStep, play, stop }
}