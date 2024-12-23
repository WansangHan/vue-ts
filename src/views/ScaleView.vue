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
    <DataViewerModal
      v-if="showDetailModal"
      :visible="showDetailModal"
      :items="sortedScaleQuizItems"
      :columns="columns"
      @onClose="showDetailModal = false"
    />
  </div>

  <div v-else>Loading...</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import AbcNotation from '@/components/AbcNotation.vue';
import BaseModal from '@/components/Modals/BaseModal.vue';
import PianoKeys from '@/components/PianoKeys.vue';
import DataViewerModal from '@/components/Modals/DataViewerModal.vue';
import { MajorScaleToAbcNotation, getRandomMajorScale } from '@/functions/music/Scale';
import { useStore } from '@/store/modules/indexedDB';

const store = useStore();

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

const sortedScaleQuizItems = computed(() =>
  [...scaleQuizItems.value].sort((a, b) => b.saveTime - a.saveTime)
);

const columns = [
  { prop: 'scale', label: 'Scale' },
  { prop: 'isSolvedCorrectly', label: 'Solved', formatter: row => (row.isSolvedCorrectly ? '✔️' : '❌') },
  { prop: 'during', label: 'Time Taken (s)', formatter: row => (row.during / 1000).toFixed(1) },
  { prop: 'saveTime', label: 'Saved At', formatter: row => new Date(row.saveTime).toLocaleString() },
];

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

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const updateElapsedTime = () => {
  elapsedTime.value += 0.1;
  formattedElapsedTime.value = elapsedTime.value.toFixed(1);
};

function MakeQuiz() {
  answer = getRandomMajorScale();
  abcNotation.value = MajorScaleToAbcNotation(answer) + '\n|';
  quizStartTime = performance.now();
  elapsedTime.value = 0;
}

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

function OnAnswerFail() {
  modalText.value = 'Wrong answer! Try again.';
  showResultModal.value = true;
}

function OnClickNextInModal() {
  showResultModal.value = false;
  MakeQuiz();
}
</script>

<style scoped>
.close-button {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.close-button:hover {
  background-color: #0056b3;
}
</style>
