import { ChromaticNote, getNoteFromRoot } from '@/functions/music/Note';

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

export const getChordNotes = (root: ChromaticNote, type: ChordType): ChromaticNote[] => {
  switch (type) {
    case ChordType.Major:
      return [root, getNoteFromRoot(root, 4), getNoteFromRoot(root, 7)];
    case ChordType.Minor:
      return [root, getNoteFromRoot(root, 3), getNoteFromRoot(root, 7)];
    case ChordType.Major7:
      return [root, getNoteFromRoot(root, 4), getNoteFromRoot(root, 7), getNoteFromRoot(root, 11)];
    case ChordType.Minor7:
      return [root, getNoteFromRoot(root, 3), getNoteFromRoot(root, 7), getNoteFromRoot(root, 10)];
    case ChordType.Dominant7:
      return [root, getNoteFromRoot(root, 4), getNoteFromRoot(root, 7), getNoteFromRoot(root, 10)];
    case ChordType.Sus2:
      return [root, getNoteFromRoot(root, 2), getNoteFromRoot(root, 7)];
    case ChordType.Sus4:
      return [root, getNoteFromRoot(root, 5), getNoteFromRoot(root, 7)];
    case ChordType.Diminished:
      return [root, getNoteFromRoot(root, 3), getNoteFromRoot(root, 6)];
    case ChordType.Augmented:
      return [root, getNoteFromRoot(root, 4), getNoteFromRoot(root, 8)];
    case ChordType.HalfDiminished:
      return [root, getNoteFromRoot(root, 3), getNoteFromRoot(root, 6), getNoteFromRoot(root, 10)];
    case ChordType.Power:
      return [root, getNoteFromRoot(root, 7)];
    default:
      return [];
  }
};
