// src/functions/music/Interval.ts

import { ChromaticNote } from "./Note";

// 음정(Enum) 정의
export enum Interval {
  PERFECT_UNISON = "완전 1도",
  MINOR_SECOND = "단 2도",
  MAJOR_SECOND = "장 2도",
  AUGMENTED_SECOND = "증 2도",
  MINOR_THIRD = "단 3도",
  MAJOR_THIRD = "장 3도",
  DIMINISHED_THIRD = "감 3도",
  PERFECT_FOURTH = "완전 4도",
  AUGMENTED_FOURTH = "증 4도",
  DIMINISHED_FIFTH = "감 5도",
  PERFECT_FIFTH = "완전 5도",
  MINOR_SIXTH = "단 6도",
  MAJOR_SIXTH = "장 6도",
  AUGMENTED_SIXTH = "증 6도",
  MINOR_SEVENTH = "단 7도",
  MAJOR_SEVENTH = "장 7도",
  PERFECT_OCTAVE = "완전 8도",
}

// **기본 계이름 거리 (C 기준)**
const DIATONIC_STEPS: { [key: string]: number } = {
  "C": 1, "D": 2, "E": 3, "F": 4, "G": 5, "A": 6, "B": 7,
};

// **음정 품질 판별 (기본 반음 개수 vs 실제 반음 개수)**
const INTERVAL_QUALITY: { [key: number]: { [key: number]: Interval } } = {
  1: { 0: Interval.PERFECT_UNISON },
  2: { 1: Interval.MINOR_SECOND, 2: Interval.MAJOR_SECOND, 3: Interval.AUGMENTED_SECOND },
  3: { 3: Interval.MINOR_THIRD, 4: Interval.MAJOR_THIRD, 2: Interval.DIMINISHED_THIRD },
  4: { 4: Interval.DIMINISHED_FIFTH, 5: Interval.PERFECT_FOURTH, 6: Interval.AUGMENTED_FOURTH },
  5: { 6: Interval.DIMINISHED_FIFTH, 7: Interval.PERFECT_FIFTH, 8: Interval.AUGMENTED_FOURTH },
  6: { 8: Interval.MINOR_SIXTH, 9: Interval.MAJOR_SIXTH, 10: Interval.AUGMENTED_SIXTH },
  7: { 10: Interval.MINOR_SEVENTH, 11: Interval.MAJOR_SEVENTH },
  8: { 12: Interval.PERFECT_OCTAVE },
};

// **계이름 가져오기**
function getLetterName(note: ChromaticNote): string {
  return Object.keys(DIATONIC_STEPS)[note % 12];
}

// **기본 음정 거리(계이름 거리) 계산**
function getDiatonicInterval(note1: ChromaticNote, note2: ChromaticNote): number {
  const name1 = getLetterName(note1);
  const name2 = getLetterName(note2);
  return ((DIATONIC_STEPS[name2] - DIATONIC_STEPS[name1]) + 7) % 7 + 1;
}

// **반음 개수 계산**
export function getIntervalBetween(note1: ChromaticNote, note2: ChromaticNote): number {
  return (note2 - note1 + 12) % 12;
}

// **음정 명칭 반환**
export function getIntervalName(note1: ChromaticNote, note2: ChromaticNote): string {
  const diatonicInterval = getDiatonicInterval(note1, note2);
  const semitoneDiff = getIntervalBetween(note1, note2);

  return INTERVAL_QUALITY[diatonicInterval]?.[semitoneDiff] || "알 수 없는 음정";
}
