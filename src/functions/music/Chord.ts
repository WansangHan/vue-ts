import { ChromaticNote } from '@/functions/music/Note';

export enum ChordType {
  Major = "Major",
  Minor = "Minor",
  Major7 = "Major7",
  Minor7 = "Minor7",
  Dominant7 = "Dominant7",
  Sus2 = "Sus2",
  Sus4 = "Sus4",
  Diminished = "Diminished",
  Augmented = "Augmented",
  HalfDiminished = "HalfDiminished",
  Power = "Power"
} 

// 🎹 코드 타입별 구성음 매핑
const chordFormulas: Record<ChordType, number[]> = {
  [ChordType.Major]: [0, 4, 7], // 루트, 장3도, 완전5도
  [ChordType.Minor]: [0, 3, 7], // 루트, 단3도, 완전5도
  [ChordType.Diminished]: [0, 3, 6], // 루트, 단3도, 감5도
  [ChordType.Augmented]: [0, 4, 8], // 루트, 장3도, 증5도
  [ChordType.Dominant7]: [0, 4, 7, 10], // 루트, 장3도, 완전5도, 단7도
  [ChordType.Major7]: [0, 4, 7, 11], // 루트, 장3도, 완전5도, 장7도
  [ChordType.Minor7]: [0, 3, 7, 10], // 루트, 단3도, 완전5도, 단7도
  [ChordType.Sus2]: [0, 2, 7], // 루트, 2도, 완전5도
  [ChordType.Sus4]: [0, 5, 7], // 루트, 4도, 완전5도
  [ChordType.HalfDiminished]: [0, 3, 6, 10], // 루트, 단3도, 감5도, 단7도
  [ChordType.Power]: [0, 7], // 루트, 완전5도
};

// 🎼 루트 노트와 코드 타입에 맞는 구성음 반환
export const getChordNotes = (root: ChromaticNote, type: ChordType): string[] => {
  const noteOrder = Object.values(ChromaticNote) as string[];
  const rootIndex = noteOrder.indexOf(root.toString());
  if (rootIndex === -1) return [];
  return (chordFormulas[type] as number[]).map(interval => noteOrder[(rootIndex + interval) % 12]);
};