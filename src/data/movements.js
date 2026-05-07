export const movements = [
  {
    id: '2-5-1',
    name: '2-5-1',
    description: 'The backbone of gospel resolution.',
    tags: ['beginner', 'worship'],
    defaultKey: 'C',
    defaultBpm: 80,
    beatsPerChord: 2,
    chords: [
      { name: '2min7', degree: 2, type: 'min7'},
      { name: '5dom7', degree: 5, type: 'dom7'},
      { name: '1maj7', degree: 1, type: 'maj7'},
    ],
  },
  {
    id: '1-4-5-1',
    name: '1-4-5-1',
    description: 'Classic church cadence. Foundation of praise & worship.',
    tags: ['beginner', 'worship'],
    defaultKey: 'C',
    defaultBpm: 100,
    beatsPerChord: 2,
    chords: [
      { name: '1', degree: 1, type: 'maj', leftHand: { degree: 1 }},
      { name: '4', degree: 4, type: 'maj', leftHand: { degree: 4 }},
      { name: '5', degree: 5, type: 'maj', leftHand: { degree: 5 }},
      { name: '1', degree: 1, type: 'maj', leftHand: { degree: 1 }},
    ],
    melody: [
      { degree: 1, octave: 5, beat: 0, duration: 2 },  // chord 1
      { degree: 4, octave: 5, beat: 2, duration: 2 },  // chord 2
      { degree: 5, octave: 5, beat: 4, duration: 1 },  // chord 3 beat 1
      { degree: 7, octave: 5, beat: 5, duration: 1 },  // chord 3 beat 2
      { degree: 1, octave: 6, beat: 6, duration: 2 },  // chord 4 resolve
    ],
  },
  {
    id: 'passing-dim',
    name: 'Passing Dim',
    description: 'Chromatic tension into resolution. Essential shout music tool.',
    tags: ['advanced', 'shout'],
    defaultKey: 'C',
    defaultBpm: 72,
    beatsPerChord: 2,
    chords: [
      { name: '1',     degree: 1, type: 'maj' },
      { name: '#1dim', degree: 1, type: 'dim', chromaticRoot: 1 },
      { name: '2min7', degree: 2, type: 'min7'},
    ],
  },
  {
    id: '1-6-2-5',
    name: '1-6-2-5',
    description: 'The gospel turnaround. Keeps the energy cycling.',
    tags: ['advanced', 'worship'],
    defaultKey: 'C',
    defaultBpm: 72,
    beatsPerChord: 2,
    chords: [
      { name: '1maj7', degree: 1, type: 'maj7'},
      { name: '6min7', degree: 6, type: 'min7'},
      { name: '2min7', degree: 2, type: 'min7'},
      { name: '5dom7', degree: 5, type: 'dom7'},
    ],
  },
  {
    id: 'shout-vamp',
    name: 'Shout Vamp',
    description: 'The groove under the shout break. Rhythm + repetition.',
    tags: ['shout', 'advanced'],
    defaultKey: 'C',
    defaultBpm: 72,
    beatsPerChord: 2,
    chords: [
      { name: '4', degree: 4, type: 'maj', leftHand: { degree: 4 }},
      { name: '5', degree: 5, type: 'maj', leftHand: { degree: 5 }},
      { name: '1', degree: 1, type: 'maj', leftHand: { degree: 1 }},
    ],
  },
  {
    id: 'passing-dim-minor',
    name: 'Passing Dim Minor',
    description: 'Great way to transition into the minor 6.',
    tags: ['advanced'],
    defaultKey: 'C',
    defaultBpm: 72,
    beatsPerChord: 2,
    chords: [
      { name: '1',     degree: 1, type: 'maj' },
      { name: '#5dim', degree: 5, type: 'dim', chromaticRoot: 1 },
      { name: '6min',  degree: 6, type: 'min' },
    ],
  },
  {
    id: 'passing-dim-minor2',
    name: '5 Passing to Minor 6',
    description: 'Great way to transition into the minor 6.',
    tags: ['advanced'],
    defaultKey: 'C',
    defaultBpm: 120,
    beatsPerChord: 2,
    chords: [
      { name: '5',     degree: 5, leftHand: { degree: 5 }, type: 'maj', octaveShift: -1 },
      { name: '5',     degree: 5, leftHand: { degree: 7 }, type: 'maj', octaveShift: -1 },
      { name: '1aug',  degree: 1, leftHand: { degree: 3 }, type: 'aug', octaveShift: -1, inversion: 2},
      { name: '#5dim', degree: 5, leftHand: { degree: 5, chromaticOffset: 1 }, type: 'dim', octaveShift: -1, chromaticRoot: 1, inversion: 0},
      { name: '6min',  degree: 6, leftHand: { degree: 6 }, type: 'min', octaveShift: -1},
    ],
  },
  {
    id: 'majic 67',
    name: '1 passing to 4',
    description: 'Idek rn',
    tags: ['advanced'],
    defaultKey: 'C',
    defaultBpm: 72,
    beatsPerChord: 3,
    chords: [
      { name: '1',     degree: 1, leftHand: { degree: 1 }, type: 'maj7', octaveShift: -1, inversion: 2},
      { name: '1',     degree: 1, leftHand: { degree: 6, chromaticOffset: 1 }, type: 'dom7', octaveShift: -1,},
      { name: '1',     degree: 4, leftHand: { degree: 4 }, type: 'maj7', octaveShift: -1},
    ],
    melody: [
      { degree: 5, octave: 5, beat: 0, duration: 2 },
      { degree: 4, octave: 5, beat: 1.5, duration: 0.5 },
      { degree: 3, octave: 5, beat: 2, duration: 1 },

      { degree: 3, octave: 5, beat: 3, duration: 2 },
      { degree: 2, octave: 5, beat: 4, duration: 1 },
      { degree: 1, octave: 5, beat: 5, duration: 1 },

      { degree: 6, octave: 5, beat: 6, duration: 3 },
    ],
  },
]

export const ALL_KEYS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']