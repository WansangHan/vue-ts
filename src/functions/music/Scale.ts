import { ChromaticNote } from '@/functions/music/Note';

export function MajorScaleToAbcNotation(note: ChromaticNote): string 
{
    const abcNotations: string[] = [
        "K:C",
        "K:Db",
        "K:D",
        "K:Eb",
        "K:E",
        "K:F",
        "K:Gb",
        "K:G",
        "K:Ab",
        "K:A",
        "K:Bb",
        "K:B",
    ];

    return abcNotations[note];
}