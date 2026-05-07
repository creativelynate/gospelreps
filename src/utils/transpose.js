const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

const ENHARMONIC = {
    'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
}

const CHORD_INTERVALS = {
    maj: [0, 4, 7],
    min: [0, 3, 7],
    aug: [0, 4, 8],
    dim: [0, 3, 6],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    dim7: [0, 3, 6, 9],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    maj9: [0, 4, 7, 11, 14],
    dom9: [0, 4, 7, 10, 14],
    min9: [0, 3, 7, 10, 14],
    dom11: [0, 4, 7, 10, 14, 17],
    dom13: [0, 4, 7, 10, 14, 17, 21],
    minmaj7: [0, 3, 7, 11],
}

function noteToIndex(note) {
    const normalized = ENHARMONIC[note] ?? note
    return CHROMATIC.indexOf(normalized)
}

function buildScale(rootNote) {
    const rootIndex = noteToIndex(rootNote)
    if (rootIndex === -1) throw new Error(`Unknown note: ${rootNote}`)
    return [0, 2, 4, 5, 7, 9, 11].map(step => CHROMATIC[(rootIndex + step) % 12])
}

function buildChord(rootNote, type, startOctave = 4) {
    const intervals = CHORD_INTERVALS[type]
    if (!intervals) throw new Error(`Unknown chord type: ${type}`)
    const rootIndex = noteToIndex(rootNote)

    return intervals.map(semitones => {
        const noteIndex = (rootIndex + semitones) % 12
        const octaveBump = (rootIndex + semitones) >= 12 ? 1 : 0
        return `${CHROMATIC[noteIndex]}${startOctave + octaveBump}`
    })
}

// Maps internal type keys → standard chord notation suffix
const CHORD_DISPLAY = {
    maj: '',        // C
    min: 'm',       // Cm
    aug: 'aug',     // Caug
    dim: 'dim',     // Cdim
    maj7: 'maj7',    // Cmaj7
    min7: 'm7',      // Cm7
    dom7: '7',       // C7
    dim7: 'dim7',    // Cdim7
    sus2: 'sus2',    // Csus2
    sus4: 'sus4',    // Csus4
    maj9: 'maj9',    // Cmaj9
    dom9: '9',       // C9
    min9: 'm9',      // Cm9
    dom11: '11',     // C11
    dom13: '13',     // C13
    minmaj7: 'mM7',  // CmM7
}

export function buildChordName(chord, key) {
    const scale = buildScale(key)

    // Resolve root note
    let rootIndex = noteToIndex(scale[(chord.degree - 1) % 7])
    if (chord.chromaticRoot) {
        rootIndex = (rootIndex + chord.chromaticRoot) % 12
    }
    const rootNote = CHROMATIC[rootIndex]

    // Get display suffix — fall back to raw type if not in map
    const suffix = CHORD_DISPLAY[chord.type] ?? chord.type

    const chordName = `${rootNote}${suffix}`

    // Slash chord: C/G format
    if (chord.leftHand) {
        let lhIndex = noteToIndex(scale[(chord.leftHand.degree - 1) % 7])
        if (chord.leftHand.chromaticOffset) {
            lhIndex = (lhIndex + chord.leftHand.chromaticOffset) % 12
        }
        const bassNote = CHROMATIC[lhIndex]
        // Only show slash if bass differs from chord root
        if (bassNote !== rootNote) {
            return `${chordName}/${bassNote}`
        }
    }

    return chordName
}

export function resolveMovement(movement, key) {
    const scale = buildScale(key)

    return movement.chords.map(chord => {
        let rootIndex = noteToIndex(scale[(chord.degree - 1) % 7])
        if (chord.chromaticRoot) {
            rootIndex = (rootIndex + chord.chromaticRoot) % 12
        }
        const rootNote = CHROMATIC[rootIndex]
        const startOctave = 4 + (chord.octaveShift ?? 0)
        const notes = buildChord(rootNote, chord.type, startOctave)

        // Resolve leftHand degree → single bass note at octave 2
        let leftHandNote = null
        if (chord.leftHand) {
            const lhDegree = chord.leftHand.degree
            let lhIndex = noteToIndex(scale[(lhDegree - 1) % 7])
            if (chord.leftHand.chromaticOffset) {
                lhIndex = (lhIndex + chord.leftHand.chromaticOffset) % 12
            }
            leftHandNote = `${CHROMATIC[lhIndex]}2`
        }

        return { ...chord, notes, leftHandNote }
    })
}

export function resolveMelody(movement, key) {
    if (!movement.melody || movement.melody.length === 0) return []
    const scale = buildScale(key)

    return movement.melody.map(m => {
        const scaleNote = scale[(m.degree - 1) % 7]
        return {
            note: scaleNote,
            octave: m.octave,
            beat: m.beat,
            duration: m.duration,
            id: `${scaleNote}${m.octave}`,
        }
    })
}

export function invertChord(notes, inversion) {
    let result = [...notes]
    for (let i = 0; i < inversion; i++) {
        const moved = result.shift()
        const noteName = moved.slice(0, -1)
        const octave = parseInt(moved.slice(-1)) + 1
        result.push(`${noteName}${octave}`)
    }
    return result
}

export function getInversionLabel(inversion) {
    return ['Root', '1st', '2nd', '3rd'][inversion] ?? 'Root'
}

export function maxInversions(notes) {
    return notes.length - 1
}

export function stripOctave(noteWithOctave) {
    return noteWithOctave.slice(0, -1)
}