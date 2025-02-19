export interface QuizItem {
    id?: number; // 고유 ID
    saveTime: number; // 저장 시간 (timestamp)
    isSolvedCorrectly: boolean; // 한 번에 맞췄는지 여부
    during: number; // 정답까지 걸린 시간 (ms)
  }
  
  // 코드 퀴즈 인터페이스
  export interface ChordQuizItem extends QuizItem {
    chord: string; // 코드 이름 (예: "Cmaj7")
  }
  
  // 음정 퀴즈 인터페이스
  export interface IntervalQuizItem extends QuizItem {
    interval: string; // 음정 이름 (예: "P5")
  }
  
  // 스케일 퀴즈 인터페이스
  export interface ScaleQuizItem extends QuizItem {
    scale: string; // 스케일 이름 (예: "C Major")
  }
  
  // 스케일 디그리 퀴즈 인터페이스
  export interface ScaleDegreeQuizItem extends QuizItem {
    scaleDegree: string; // 스케일 디그리 (예: "Mediant (III)")
  }
  