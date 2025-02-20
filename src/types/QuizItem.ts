export interface BaseQuizItem {
    id: number;
    question: string;
    interval: number; // 공통 속성 추가
    lastReviewed: Date;
  }
  
  export interface ChordQuizItem extends BaseQuizItem {
    chordType: string;
  }
  
  export interface IntervalQuizItem extends BaseQuizItem {
    intervalType: string;
  }
  
  export interface ScaleQuizItem extends BaseQuizItem {
    scaleType: string;
  }
  
  export interface ScaleDegreeQuizItem extends BaseQuizItem {
    degree: number;
  }
  
  export type QuizItem = ChordQuizItem | IntervalQuizItem | ScaleQuizItem | ScaleDegreeQuizItem;
  
  export enum QuizType {
    Chord = 'ChordQuizStore',
    Interval = 'IntervalQuizStore',
    Scale = 'ScaleQuizStore',
    ScaleDegree = 'ScaleDegreeQuizStore',
  }