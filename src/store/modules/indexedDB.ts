import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  ChordQuizItem,
  IntervalQuizItem,
  ScaleQuizItem,
  ScaleDegreeQuizItem,
} from '@/types/QuizItem';

// Vuex Store Key
export const key: InjectionKey<Store<State>> = Symbol();

// 퀴즈 유형을 Enum으로 정의
export enum QuizType {
  Chord = 'ChordQuizStore',
  Interval = 'IntervalQuizStore',
  Scale = 'ScaleQuizStore',
  ScaleDegree = 'ScaleDegreeQuizStore',
}

// 데이터베이스 설정
const DB_NAME = 'BrainHarmonicsDB';
const DB_VERSION = 1;

// Vuex 상태 정의
interface State {
  db: IDBPDatabase<BrainHarmonicsDB> | null;
  scaleQuizItems: ScaleQuizItem[];
}

// DBSchema 확장하여 데이터베이스 구조 정의
interface BrainHarmonicsDB extends DBSchema {
  [QuizType.Chord]: {
    key: number;
    value: ChordQuizItem;
  };
  [QuizType.Interval]: {
    key: number;
    value: IntervalQuizItem;
  };
  [QuizType.Scale]: {
    key: number;
    value: ScaleQuizItem;
  };
  [QuizType.ScaleDegree]: {
    key: number;
    value: ScaleDegreeQuizItem;
  };
}

// IndexedDB에서 퀴즈 항목을 가져오는 함수
export async function getQuizItem(quizId: string, quizType: QuizType): Promise<ChordQuizItem | IntervalQuizItem | ScaleQuizItem | ScaleDegreeQuizItem | null> {
  const db = await openDB<BrainHarmonicsDB>(DB_NAME, DB_VERSION);
  const item = await db.get(quizType, Number(quizId));
  return item === undefined ? null : item;
}

// IndexedDB에 퀴즈 결과를 저장하는 함수
export async function saveQuizResult(quizId: string, quizType: QuizType, quizItem: ChordQuizItem | IntervalQuizItem | ScaleQuizItem | ScaleDegreeQuizItem): Promise<void> {
  const db = await openDB<BrainHarmonicsDB>(DB_NAME, DB_VERSION);
  await db.put(quizType, quizItem, Number(quizId));
}

// Vuex 스토어 생성
export const store = createStore<State>({
  state: {
    db: null,
    scaleQuizItems: [],
  },
  mutations: {
    setDB(state, db: IDBPDatabase<BrainHarmonicsDB>) {
      state.db = db;
    },
    setScaleQuizItems(state, items: ScaleQuizItem[]) {
      state.scaleQuizItems = items;
    },
  },
  actions: {
    async initDB({ commit }) {
      const db = await openDB<BrainHarmonicsDB>(DB_NAME, DB_VERSION);
      commit('setDB', db);
    },
    async fetchScaleQuizItems({ state, commit }) {
      if (!state.db) return;
      const items = await state.db.getAll(QuizType.Scale);
      commit('setScaleQuizItems', items);
    },
  },
});