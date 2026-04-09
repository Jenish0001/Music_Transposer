// Sargam note names and their scale degrees
export const SWAR_DEGREES = { S: 0, R: 1, G: 2, M: 3, P: 4, D: 5, N: 6 };

// Major scale semitone offsets from root: W-W-H-W-W-W-H
// S=0, R=2, G=4, M=5, P=7, D=9, N=11
export const MAJOR_SCALE_SEMITONES = [0, 2, 4, 5, 7, 9, 11];

export const WESTERN_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const SA_OPTIONS = WESTERN_NOTES;

// Sargam swars in order (index = scale degree)
export const SWAR_ORDER = ['S', 'R', 'G', 'M', 'P', 'D', 'N'];

/**
 * Parse a single note token into a note object.
 * Returns null if not a valid note.
 */
export function parseNote(token) {
  // Match: optional note letter, optional (k), optional octave marker '
  // Valid: S, R, G, M, P, D, N with optional (k), m (tivra), and optional '
  const match = token.match(/^([SRGMmPDN])(\(k\))?('?)$/);
  if (!match) return null;

  const rawSwar = match[1];
  const komal = match[2] === '(k)';
  const octave = match[3] === "'" ? 1 : 0;

  // Normalize: lowercase 'm' means tivra Ma
  const tivra = rawSwar === 'm';
  const swar = tivra ? 'M' : rawSwar.toUpperCase();

  return { swar, komal, tivra, octave };
}

/**
 * Tokenize a notation line, preserving formatting symbols.
 * Returns array of { type: 'note'|'symbol', value, raw }
 */
export function tokenizeNotation(line) {
  const tokens = [];
  let i = 0;
  while (i < line.length) {
    // Try to match a note: [SRGMmPDN] optionally followed by (k) and/or '
    const noteMatch = line.slice(i).match(/^([SRGMmPDN])(\(k\))?('?)/);
    if (noteMatch) {
      const raw = noteMatch[0];
      const noteObj = parseNote(raw);
      tokens.push({ type: 'note', value: noteObj, raw });
      i += raw.length;
    } else {
      // Symbol: any non-note character
      tokens.push({ type: 'symbol', value: line[i], raw: line[i] });
      i++;
    }
  }
  return tokens;
}

/**
 * Get the semitone value of a note object relative to Sa=0.
 */
export function noteToSemitone(noteObj) {
  const baseSemitone = MAJOR_SCALE_SEMITONES[SWAR_DEGREES[noteObj.swar]];
  let semitone = baseSemitone;
  if (noteObj.komal) semitone -= 1;
  if (noteObj.tivra) semitone += 1;
  semitone += noteObj.octave * 12;
  return semitone;
}

/**
 * Given a Sa base note (e.g., 'C', 'D#') and a note object,
 * return the Western note name.
 */
export function noteToWestern(noteObj, saNote) {
  const saIndex = WESTERN_NOTES.indexOf(saNote);
  if (saIndex === -1) return '?';
  const semitone = noteToSemitone(noteObj);
  const westernIndex = (saIndex + semitone) % 12;
  return WESTERN_NOTES[(westernIndex + 12) % 12];
}

/**
 * Transpose a note by a number of semitone steps.
 * Returns a new note object.
 */
export function transposeNote(noteObj, steps) {
  const currentSemitone = noteToSemitone(noteObj);
  const newSemitone = currentSemitone + steps;

  // Map back to sargam
  return semitoneToSargam(newSemitone);
}

/**
 * Convert a semitone offset (relative to Sa) back to a sargam note object.
 */
export function semitoneToSargam(semitone) {
  const octave = Math.floor(semitone / 12);
  const relSemitone = ((semitone % 12) + 12) % 12;

  // Check exact matches first
  for (let i = 0; i < MAJOR_SCALE_SEMITONES.length; i++) {
    if (MAJOR_SCALE_SEMITONES[i] === relSemitone) {
      return { swar: SWAR_ORDER[i], komal: false, tivra: false, octave };
    }
  }

  // Check komal (one semitone below standard positions)
  for (let i = 1; i < MAJOR_SCALE_SEMITONES.length; i++) {
    if (MAJOR_SCALE_SEMITONES[i] - 1 === relSemitone) {
      return { swar: SWAR_ORDER[i], komal: true, tivra: false, octave };
    }
  }

  // Check tivra Ma (M+1 = semitone 6)
  if (relSemitone === 6) {
    return { swar: 'M', komal: false, tivra: true, octave };
  }

  // Fallback: return as unknown
  return { swar: '?', komal: false, tivra: false, octave };
}

/**
 * Render a note object back to sargam string.
 */
export function noteToSargam(noteObj) {
  if (!noteObj || noteObj?.swar === '?') return noteObj?.raw || '?';
  let s = noteObj.swar;
  if (noteObj.tivra) s = 'm'; // tivra Ma rendered as lowercase m
  if (noteObj.komal) s += '(k)';
  if (noteObj.octave > 0) s += "'".repeat(noteObj.octave);
  return s;
}

/**
 * Parse a full multiline song text into pairs: [{lyrics, notation}]
 */
export function parseSongText(text) {
  const lines = text.split('\n');
  const pairs = [];
  let i = 0;
  while (i < lines.length) {
    const lyrics = lines[i] || '';
    const notation = lines[i + 1] || '';
    if (lyrics.trim() || notation.trim()) {
      pairs.push({ lyrics, notation });
    }
    i += 2;
  }
  return pairs;
}

/**
 * Transpose a notation line and return tokens with transposed values.
 */
export function transposeNotationLine(notationLine, steps) {
  const tokens = tokenizeNotation(notationLine);
  return tokens.map(token => {
    if (token.type === 'note' && token.value) {
      const transposed = transposeNote(token.value, steps);
      return { ...token, transposed };
    }
    return token;
  });
}
