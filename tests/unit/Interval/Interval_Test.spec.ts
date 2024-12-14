import { SolfegeNote, ChromaticNote, getSolfegeNoteDistance, getChromaticNoteDistance, getRandomChromaticNote, getFullRangeNoteByChromaticNote, FullRangeNote } from "@/functions/music/Note";

describe("Interval", () => {
    it("SolfegeNote Interval Test", () => {
        // (레) 1도 차이
        expect(getSolfegeNoteDistance(SolfegeNote.D, SolfegeNote.D)).toBe(1);
        // (도) 레 (미) 3도 차이
        expect(getSolfegeNoteDistance(SolfegeNote.C, SolfegeNote.E)).toBe(3);
        // (라) 시 (도) 3도 차이
        expect(getSolfegeNoteDistance(SolfegeNote.A, SolfegeNote.C)).toBe(3);
        // (파) 솔 라 시 도 레 (미) 7도 차이
        expect(getSolfegeNoteDistance(SolfegeNote.F, SolfegeNote.E)).toBe(7);
    })

    it("ChromaticNote Interval Test", () => {
        // (도) 레b 레 미b (미) 4개의 반음이 있다.
        expect(getChromaticNoteDistance(ChromaticNote.C, ChromaticNote.E)).toBe(4);
        // (라) 시b 시 (도) 3개의 반음이 있다.
        expect(getChromaticNoteDistance(ChromaticNote.A, ChromaticNote.C)).toBe(3);
    })

    it("ChromaticNote GetRandom Test", () => {
        const chrometicNotes = new Set<ChromaticNote>([
            ChromaticNote.C,
            ChromaticNote.C_D, ChromaticNote.D,
            ChromaticNote.D_E, ChromaticNote.E,
            ChromaticNote.F,
            ChromaticNote.F_G, ChromaticNote.G,
            ChromaticNote.G_A, ChromaticNote.A,
            ChromaticNote.A_B, ChromaticNote.B,
        ])

        // getRandomChromaticNote에서 모든 ChromaticNote가
        // 랜덤으로 뽑혀 나올 떄 까지 무한 루프
        while(chrometicNotes.size)
        {
            // ChromaticNote 중 하나를 랜덤으로 뽑는다.
            const rand = getRandomChromaticNote();
            
            // rand는 ChromaticNote.C와 ChromaticNote.B 사이여야 한다.
            expect(rand).toBeGreaterThanOrEqual(ChromaticNote.C);
            expect(rand).toBeLessThanOrEqual(ChromaticNote.B);

            // ChromaticNote가 전부 모여있는 set에서 하나씩 delete한다.
            chrometicNotes.delete(getRandomChromaticNote());
        }
    })

    it("getFullRangeNotesByChromaticNote test", () => {
        let allFullRangeNotes = getFullRangeNoteByChromaticNote(ChromaticNote.A);
        // A0 ~ A7까지 7개이다.
        expect(allFullRangeNotes.length).toEqual(8);
        expect(allFullRangeNotes).toContain(FullRangeNote.A0);
        expect(allFullRangeNotes).toContain(FullRangeNote.A1);
        expect(allFullRangeNotes).toContain(FullRangeNote.A2);
        expect(allFullRangeNotes).toContain(FullRangeNote.A3);
        expect(allFullRangeNotes).toContain(FullRangeNote.A4);
        expect(allFullRangeNotes).toContain(FullRangeNote.A5);
        expect(allFullRangeNotes).toContain(FullRangeNote.A6);
        expect(allFullRangeNotes).toContain(FullRangeNote.A7);

        allFullRangeNotes = getFullRangeNoteByChromaticNote(ChromaticNote.F_G);
        // F_G1 ~ F_7까지 7개이다.
        expect(allFullRangeNotes.length).toEqual(7);
        expect(allFullRangeNotes).toContain(FullRangeNote.F_G1);
        expect(allFullRangeNotes).toContain(FullRangeNote.F_G2);
        expect(allFullRangeNotes).toContain(FullRangeNote.F_G3);
        expect(allFullRangeNotes).toContain(FullRangeNote.F_G4);
        expect(allFullRangeNotes).toContain(FullRangeNote.F_G5);
        expect(allFullRangeNotes).toContain(FullRangeNote.F_G6);
        expect(allFullRangeNotes).toContain(FullRangeNote.F_G7);

        allFullRangeNotes = getFullRangeNoteByChromaticNote(ChromaticNote.C);
        // C1 ~ C8까지 8개이다.
        expect(allFullRangeNotes.length).toEqual(8);
        expect(allFullRangeNotes).toContain(FullRangeNote.C1);
        expect(allFullRangeNotes).toContain(FullRangeNote.C2);
        expect(allFullRangeNotes).toContain(FullRangeNote.C3);
        expect(allFullRangeNotes).toContain(FullRangeNote.C4);
        expect(allFullRangeNotes).toContain(FullRangeNote.C5);
        expect(allFullRangeNotes).toContain(FullRangeNote.C6);
        expect(allFullRangeNotes).toContain(FullRangeNote.C7);
        expect(allFullRangeNotes).toContain(FullRangeNote.C8);
    })
})