<template>
  <div v-if="!loading">
    <!-- 시간 표시 및 상세 버튼 -->
    <div>
      elapsed : {{ formattedElapsedTime }}
      <button @click="showDetailModal = true">detail</button>
    </div>

    <!-- ABC 노테이션 -->
    <AbcNotation v-if="abcNotation" :notation="abcNotation" />

    <!-- 피아노 건반 컴포넌트 -->
    <PianoKeys
      :answer="answer"
      @on-answer-correct="OnAnswerCorrect"
      @on-answer-fail="OnAnswerFail"
    />

    <!-- 결과 모달 -->
    <BaseModal v-if="showResultModal" :visible="showResultModal" @next="OnClickNextInModal">
      {{ modalText }}
    </BaseModal>

    <!-- 상세 모달 -->
    <BaseModal v-if="showDetailModal" :visible="showDetailModal" @next="showDetailModal = false">
      <el-table :data="sortedScaleQuizItems" border style="width: 100%">
        <el-table-column prop="scale" label="Scale" />
        <el-table-column
          prop="isSolvedCorrectly"
          label="Solved"
          :formatter="formatSolvedStatus"
        />
        <el-table-column
          prop="during"
          label="Time Taken (s)"
          :formatter="formatTimeTaken"
        />
        <el-table-column
          prop="saveTime"
          label="Saved At"
          :formatter="formatSaveTime"
        />
      </el-table>
    </BaseModal>
  </div>

  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import AbcNotation from '@/components/AbcNotation.vue';
import BaseModal from '@/components/Modals/BaseModal.vue';
import PianoKeys from '@/components/PianoKeys.vue';
import { MajorScaleToAbcNotation, getRandomMajorScale } from '@/functions/music/Scale';
import { useStore } from '@/store/modules/indexedDB';
import { ElMessageBox } from 'element-plus';

const store = useStore();

// 상태 변수
const loading = ref(true);
const abcNotation = ref('');
const formattedElapsedTime = ref('0.0');
const showResultModal = ref(false);
const showDetailModal = ref(false);
const modalText = ref('');
const elapsedTime = ref(0);
const scaleQuizItems = computed(() => store.state.scaleQuizItems);
let intervalId = null;
let answer = null;
let quizStartTime = null;

// 계산된 정렬된 데이터
const sortedScaleQuizItems = computed(() =>
  [...scaleQuizItems.value].sort((a, b) => b.saveTime - a.saveTime) // 최근 저장된 순으로 정렬
);

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
  try {
    await store.dispatch('initDB');
    await store.dispatch('getAllItems');
    MakeQuiz();
    intervalId = setInterval(updateElapsedTime, 100);
  } finally {
    loading.value = false;
  }
});

// 컴포넌트 언마운트 시 타이머 정리
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

// 경과 시간 업데이트
const updateElapsedTime = () => {
  elapsedTime.value += 0.1;
  formattedElapsedTime.value = elapsedTime.value.toFixed(1);
};

// 퀴즈 생성
function MakeQuiz() {
  answer = getRandomMajorScale();
  abcNotation.value = MajorScaleToAbcNotation(answer) + '\n|';
  quizStartTime = performance.now();
  elapsedTime.value = 0;
}

// 정답 처리
async function OnAnswerCorrect() {
  const duration = performance.now() - quizStartTime;
  modalText.value = `You took ${(duration / 1000).toFixed(1)} seconds`;
  showResultModal.value = true;

  const item = {
    scale: answer,
    saveTime: Date.now(),
    isSolvedCorrectly: true,
    during: duration,
  };

  await store.dispatch('addScaleQuizStore', item);
  scaleQuizItems.value.push(item);
}

// 오답 처리
function OnAnswerFail() {
  modalText.value = 'Wrong answer! Try again.';
  showResultModal.value = true;
}

// 다음 문제로 이동
function OnClickNextInModal() {
  showResultModal.value = false;
  MakeQuiz();
}

// 포맷터 함수
function formatSolvedStatus(row) {
  return row.isSolvedCorrectly ? '✔️' : '❌';
}

function formatTimeTaken(row) {
  return (row.during / 1000).toFixed(1);
}

function formatSaveTime(row) {
  return new Date(row.saveTime).toLocaleString();
}
</script>
