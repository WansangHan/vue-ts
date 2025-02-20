<template>
  <div v-if="!loading">
    <!-- 시간 표시 및 상세 버튼 -->
    <div>
      경과 시간: {{ formattedElapsedTime }}
      <button @click="showDetailModal = true">상세</button>
    </div>
    <!-- ABC 노테이션 -->
    <AbcNotation v-if="abcNotation" :notation="abcNotation" />
    <!-- 피아노 건반 컴포넌트 -->
    <PianoKeys
      :answer="answer"
      @on-answer-correct="onAnswerCorrect"
      @on-answer-fail="onAnswerFail"
    />
    <!-- 결과 모달 -->
    <BaseModal v-if="showResultModal" :visible="showResultModal" @next="onClickNextInModal">
      {{ modalText }}
    </BaseModal>
    <!-- 상세 모달 -->
    <BaseModal v-if="showDetailModal" :visible="showDetailModal" @next="onClickNextInModal">
      <div v-for="(note, index) in notes" :key="index">
        {{ note }}
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { SpacedRepetition } from '@/utils/SpacedRepetition';
import AbcNotation from '@/components/AbcNotation.vue';
import PianoKeys from '@/components/PianoKeys.vue';
import BaseModal from '@/components/Modals/BaseModal.vue';
import { QuizItem } from '@/types/QuizItem'; // QuizItem 타입 가져오기

const loading = ref(true);
const showResultModal = ref(false);
const showDetailModal = ref(false);
const modalText = ref('');
const abcNotation = ref('');
const answer = ref('');
const notes = ref<string[]>([]);
const startTime = ref<Date | null>(null);
const formattedElapsedTime = ref('00:00');
const currentQuiz = ref<QuizItem | null>(null);

onMounted(async () => {
  // 복습해야 할 퀴즈 불러오기
  const quizzesToReview = await SpacedRepetition.getQuizzesToReview();
  if (quizzesToReview.length > 0) {
    currentQuiz.value = quizzesToReview[0]; // 첫 번째 복습 문제 설정
    loadQuiz(currentQuiz.value);
  } else {
    // 복습할 퀴즈가 없을 경우 새로운 퀴즈 로드
    loadNewQuiz();
  }
  startTimer();
  loading.value = false;
});

function loadQuiz(quiz: QuizItem) {
  abcNotation.value = quiz.question;
  answer.value = quiz.correctAnswer;
  notes.value = parseNotesFromQuestion(quiz.question);
}

function loadNewQuiz() {
  // 새로운 퀴즈를 로드하는 로직을 구현하세요.
}

function parseNotesFromQuestion(): string[] {
  // 질문에서 노트를 파싱하는 로직을 구현하세요.
  return [];
}

function startTimer() {
  startTime.value = new Date();
  setInterval(updateElapsedTime, 1000);
}

function updateElapsedTime() {
  if (!startTime.value) return;
  const now = new Date();
  const elapsed = new Date(now.getTime() - startTime.value.getTime());
  const minutes = String(elapsed.getUTCMinutes()).padStart(2, '0');
  const seconds = String(elapsed.getUTCSeconds()).padStart(2, '0');
  formattedElapsedTime.value = `${minutes}:${seconds}`;
}

async function onAnswerCorrect() {
  modalText.value = '정답입니다!';
  showResultModal.value = true;
  if (currentQuiz.value) {
    await SpacedRepetition.updateQuizSchedule(currentQuiz.value.id, true);
  }
}

async function onAnswerFail() {
  modalText.value = '오답입니다. 다시 시도하세요.';
  showResultModal.value = true;
  if (currentQuiz.value) {
    await SpacedRepetition.updateQuizSchedule(currentQuiz.value.id, false);
  }
}

function onClickNextInModal() {
  showResultModal.value = false;
  showDetailModal.value = false;
  // 다음 퀴즈를 로드하는 로직을 구현하세요.
}
</script>

<style scoped>
.scale-view {
  text-align: center;
  padding: 20px;
}
</style>
