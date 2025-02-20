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

// Vuex Store 생성
export const store = createStore<State>({
  state: {
    db: null,
    scaleQuizItems: [],
  },
  mutations: {
    setDB(state, db: IDBPDatabase<BrainHarmonicsDB>) {
      state.db = db;
    },
    setItems(state, items: ScaleQuizItem[]) {
      state.scaleQuizItems = items;
    },
  },
  actions: {
    async initDB({ commit }) {
      const db = await openDB<BrainHarmonicsDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
          for (const storeName of Object.values(QuizType)) {
            if (!db.objectStoreNames.contains(storeName)) {
              db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            }
          }
        },
      });
      commit('setDB', db);
    },
    async addQuizResult({ state, dispatch }, { quizType, item }: { quizType: QuizType; item: Omit<ChordQuizItem, 'id'> }) {
      if (state.db) {
        await state.db.add(quizType, item);
        await dispatch('getAllItems', quizType);
      }
    },
    async getAllItems({ state, commit }, quizType: QuizType) {
      if (state.db) {
        const items = await state.db.getAll(quizType);
        commit('setItems', items);
      }
    },
    async clearQuizResults({ state }, quizType: QuizType) {
      if (state.db) {
        await state.db.clear(quizType);
      }
    },
  },
});


