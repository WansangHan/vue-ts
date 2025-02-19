import { ChromaticNote } from './Note';

export enum ScaleType {
  MAJOR = 'Major',
  MINOR = 'Minor',
}

// 각 스케일의 음 간격 (반음 단위)
const SCALE_PATTERNS = {
  [ScaleType.MAJOR]: [2, 2, 1, 2, 2, 2, 1], // 온온반온온온반
  [ScaleType.MINOR]: [2, 1, 2, 2, 1, 2, 2], // 온반온온반온온
};

/**
 * 주어진 음과 반음 수를 받아 새로운 음을 반환하는 함수
 */
function getNoteBySemitoneShift(note: ChromaticNote, semitoneShift: number): ChromaticNote {
  const notes = Object.values(ChromaticNote).filter(value => typeof value === 'number') as number[];
  const currentIndex = notes.indexOf(note);
  const newIndex = (currentIndex + semitoneShift) % notes.length;
  return notes[newIndex] as ChromaticNote;
}

/**
 * 기준음과 스케일 타입을 받아 해당 스케일의 음계를 반환하는 함수
 */
export function generateScale(root: ChromaticNote, type: ScaleType): { name: string; notes: ChromaticNote[] } {
  const notes: ChromaticNote[] = [root];
  let currentNote = root;

  for (const interval of SCALE_PATTERNS[type]) {
    currentNote = getNoteBySemitoneShift(currentNote, interval);
    notes.push(currentNote);
  }

  return { name: `${type.toUpperCase()} Scale`, notes };
}

/**
 * 랜덤 스케일을 반환하는 함수
 */
export function getRandomScale(): { name: string; notes: ChromaticNote[] } {
  const roots = Object.values(ChromaticNote).filter(value => typeof value === 'number') as ChromaticNote[];
  const types = Object.values(ScaleType).filter(value => typeof value === 'string') as ScaleType[];

  const randomRoot = roots[Math.floor(Math.random() * roots.length)];
  const randomType = types[Math.floor(Math.random() * types.length)];

  return generateScale(randomRoot, randomType);
}

/**
 * 특정 스케일에서 랜덤한 음을 반환하는 함수
 */
export function getRandomNoteFromScale(scale: { notes: ChromaticNote[] }): ChromaticNote {
  return scale.notes[Math.floor(Math.random() * scale.notes.length)];
}

/**
 * 주어진 음이 해당 스케일에서 몇 번째 음인지 반환하는 함수
 */
export function getNoteDegree(note: ChromaticNote, scale: { notes: ChromaticNote[] }): number {
  return scale.notes.indexOf(note) + 1; // 배열 인덱스를 기반으로 몇 번째인지 반환 (1부터 시작)
}

/**
 * 스케일에서 특정 계이름의 음을 반환
 */
export function getScaleDegree(scale: { notes: ChromaticNote[] }, degree: number): ChromaticNote | null {
  return scale.notes[degree - 1] || null;
}

/**
 * 특정 스케일이 특정 음을 포함하는지 확인하는 함수
 */
export function scaleContains(scale: { notes: ChromaticNote[] }, note: ChromaticNote): boolean {
  return scale.notes.includes(note);
}

/**
 * Major 스케일을 ABC 표기법으로 변환하는 함수
 */
export function MajorScaleToAbcNotation(note: ChromaticNote): string {
  const abcNotations: { [key in ChromaticNote]: string } = {
    [ChromaticNote.C]: "K:C",
    [ChromaticNote.C_D]: "K:C#",
    [ChromaticNote.D]: "K:D",
    [ChromaticNote.D_E]: "K:D#",
    [ChromaticNote.E]: "K:E",
    [ChromaticNote.F]: "K:F",
    [ChromaticNote.F_G]: "K:F#",
    [ChromaticNote.G]: "K:G",
    [ChromaticNote.G_A]: "K:G#",
    [ChromaticNote.A]: "K:A",
    [ChromaticNote.A_B]: "K:A#",
    [ChromaticNote.B]: "K:B",
  };

  return abcNotations[note];
}
