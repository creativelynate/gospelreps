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

export function buildChordName(chord, key) {
    const scale = buildScale(key)
    let rootIndex = noteToIndex(scale[(chord.degree - 1) % 7])
    let chromaticRoot = (chord.chromaticRoot !== undefined) ? chord.chromaticRoot : 0
    let chordType = (chord.type === "maj") ? "" : chord.type

    let leftHand = null
    let chromaticRootLeft = null

    let IsThereALeftHand = (chord.leftHand !== undefined) ? true : false
    if (IsThereALeftHand) {
        let leftHand = noteToIndex(scale[(chord.leftHand.degree - 1) % 7])
        let chromaticRootLeft = (chord.leftHand.chromaticOffset !== undefined) ? chord.leftHand.chromaticOffset : 0
    }

    return CHROMATIC[(Number(rootIndex) + Number(chromaticRoot))] + ((IsThereALeftHand) ? chordType + " / " + stripOctave(chord.leftHandNote) : "")
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