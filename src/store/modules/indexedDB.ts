import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { MajorScale } from '@/functions/music/Scale';

// 스케일 문제를 푼 결과를 저장하는 interface
export interface ScaleQuizItem {
  // id
  id?: number;
  // 스케일 enum 번호
  scale: MajorScale;
  // 저장 시간
  saveTime: number;
  // 한번에 정답을 맞췄는 지 여부
  isSolvedCorrectly: boolean;
  // 답을 맞출 때 까지 걸린 시간
  during: number;
}

// DBSchema는 IndexedDB의 데이터베이스 구조를 정의하는 기본 인터페이스이다
// BrainHarmonicsDB는 이 기본 인터페이스를 확장하여 특정 데이터베이스 구조를 정의한다.
// DB 내에서 사용할 타입을 만들 때에는 내부의 ScaleQuizStore처럼, Store를 늘리고 그 내부에 타입을 만든다.
interface BrainHarmonicsDB extends DBSchema {
  ScaleQuizStore: {
    key: number;
    value: ScaleQuizItem;
  };
}

// Vuex 스토어에서 상태를 타입 안전하게 관리하기 위해 사용된다
// 상태의 타입을 정의하여 Vuex 스토어에서 상태를 보다 안전하게 다룰 수 있게 한다.
interface State {
  db: IDBPDatabase<BrainHarmonicsDB> | null;
  scaleQuizItems: ScaleQuizItem[];
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    db: null,
    scaleQuizItems: []
  },
  // mutations는 동기 작업만 수행한다.
  // mutations는 state를 수정하는 유일한 방법이다.
  // mutations는 store.commit()으로 호출된다.
  mutations: {
    setDB(state, db: IDBPDatabase<BrainHarmonicsDB>) {
      state.db = db
    },
    setItems(state, items: ScaleQuizItem[]) {
      state.scaleQuizItems = items
    }
  },
  // actions는 비동기 작업도 수행한다.
  // actions는 store.dispatch()로 호출된다.
  actions: {
    async initDB({ commit }) {
      const db = await openDB<BrainHarmonicsDB>('BrainHarmonicsDatabase', 1, {
        upgrade(db) {
          db.createObjectStore('ScaleQuizStore', { keyPath: 'id', autoIncrement: true })
        }
      })
      commit('setDB', db)
    },
    async addScaleQuizStore({ state, dispatch }, item: ScaleQuizItem) {
      if (state.db) {
        await state.db.add('ScaleQuizStore', item)
        await dispatch('getAllItems')
      }
    },
    async getAllItems({ state, commit }) {
      if (state.db) {
        const items = await state.db.getAll('ScaleQuizStore')
        commit('setItems', items)
      }
    }
  }
})

export function useStore() : Store<State> {
  return baseUseStore(key)
}
