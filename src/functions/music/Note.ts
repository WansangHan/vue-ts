export enum SolfegeNote 
{
    C,
    D,
    E,
    F,
    G,
    A,
    B,
}

export enum ChromaticNote
{
    C,
    C_D,
    D,
    D_E,
    E,
    F,
    F_G,
    G,
    G_A,
    A,
    A_B,
    B,
}

export enum FullRangeNote {
    A0, 
    Bb0, B0,
    C1, C_D1, D1, D_E1, E1, F1, F_G1, G1, G_A1, A1, A_B1, B1,
    C2, C_D2, D2, D_E2, E2, F2, F_G2, G2, G_A2, A2, A_B2, B2,
    C3, C_D3, D3, D_E3, E3, F3, F_G3, G3, G_A3, A3, A_B3, B3,
    C4, C_D4, D4, D_E4, E4, F4, F_G4, G4, G_A4, A4, A_B4, B4,
    C5, C_D5, D5, D_E5, E5, F5, F_G5, G5, G_A5, A5, A_B5, B5,
    C6, C_D6, D6, D_E6, E6, F6, F_G6, G6, G_A6, A6, A_B6, B6,
    C7, C_D7, D7, D_E7, E7, F7, F_G7, G7, G_A7, A7, A_B7, B7,
    C8
}

export function getSolfegeNoteDistance(lower:SolfegeNote, higher:SolfegeNote): number
{
    if (lower == higher) {
        return 1;
    }
  
    if (lower < higher) {
        return higher - lower + 1;
    }
  
    return 8 + higher - lower;
}

export function getChromaticNoteDistance(lower:ChromaticNote, higher:ChromaticNote): number
{
    if (lower == higher) {
        return 0;
    }
  
    if (lower < higher) {
        return higher - lower;
    }
  
    return 12 + higher - lower;
}

export function getRandomChromaticNote(): ChromaticNote
{
    const rand: number = Math.random() * ChromaticNote.B;
    // rand의 결과물을 as ChromaticNote로 한다고 해서 정수형으로 바뀌지 않는다.
    // 그래서 round처리 해야한다.
    const retVal:number = Math.round(rand);
    return retVal as ChromaticNote;
}

export function convertToAbcNotation(note: FullRangeNote): string 
{
    const abcNotations: string[] = [
        "A,,,,", "_B,,,,", "B,,,,",
        "C,,,", "_D,,,", "D,,,", "_E,,,", "E,,,", "F,,,", "_G,,,", "G,,,", "_A,,,", "A,,,", "_B,,,", "B,,,",
        "C,,", "_D,,", "D,,", "_E,,", "E,,", "F,,", "_G,,", "G,,", "_A,,", "A,,", "_B,,", "B,,",
        "C,", "_D,", "D,", "_E,", "E,", "F,", "_G,", "G,", "_A,", "A,", "_B,", "B,",
        "C", "_D", "D", "_E", "E", "F", "_G", "G", "_A", "A", "_B", "B",
        "c", "_d", "d", "_e", "e", "f", "_g", "g", "_a", "a", "_b", "b",
        "c'", "_d'", "d'", "_e'", "e'", "f'", "_g'", "g'", "_a'", "a'", "_b'", "b'",
        "c''", "_d''", "d''", "_e''", "e''", "f''", "_g''", "g''", "_a''", "a''", "_b''", "b''",
        "c'''"
    ];

    return abcNotations[note];
}

export function getFullRangeNoteByChromaticNote(selected: ChromaticNote)
{
    // 첫 번쨰로 배열에 넣을 값이 A0과 얼마나 떨어져있는 지 계산한다.
    let distanceFromA0 = getChromaticNoteDistance(ChromaticNote.A, selected);

    const allNotes: FullRangeNote[] = [];

    // 모든 FullRangeNote를 다 확인할 때 까지 while
    while (distanceFromA0 <= FullRangeNote.C8)
    {
        allNotes.push(distanceFromA0 as FullRangeNote);
        // 옥타브 바로 위 접근
        distanceFromA0 += 12;
    }

    return allNotes;
}
