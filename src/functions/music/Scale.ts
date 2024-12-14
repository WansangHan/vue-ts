export enum MajorScale
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

export function getRandomMajorScale(): MajorScale
{
    const rand: number = Math.random() * MajorScale.B;
    // rand의 결과물을 as MajorScale로 한다고 해서 정수형으로 바뀌지 않는다.
    // 그래서 round처리 해야한다.
    const retVal:number = Math.round(rand);
    return retVal as MajorScale;
}

export function MajorScaleToAbcNotation(note: MajorScale): string 
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