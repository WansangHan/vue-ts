<template>
  <div class="interval-view">
    <h1>음정 맞추기</h1>
    <AbcNotation :abcNotation="abcNotation" />
    <div class="options">
      <button
        v-for="interval in intervalOptions"
        :key="interval"
        :class="{ correct: isCorrect(interval), selected: userAnswer === interval }"
        @click="checkAnswer(interval)"
      >
        {{ interval }}
      </button>
    </div>
    <p v-if="userAnswer !== null">
      {{ isCorrect(userAnswer) ? "정답입니다!" : "틀렸습니다. 다시 시도해보세요." }}
    </p>
    <button @click="generateQuestion">새 문제</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ChromaticNote } from "@/functions/music/Note";
import { getIntervalName, Interval } from "@/functions/music/Interval";
import AbcNotation from "@/components/AbcNotation.vue";

// 랜덤 음 생성 함수
const getRandomNote = () => {
  const notes = Object.values(ChromaticNote) as ChromaticNote[];
  return notes[Math.floor(Math.random() * notes.length)];
};

// 문제에 사용할 음
const note1 = ref(getRandomNote());
const note2 = ref(getRandomNote());

// 정답 음정 계산
const correctInterval = computed(() => getIntervalName(note1.value, note2.value));
const userAnswer = ref<string | null>(null);

// Interval Enum 기반으로 선택지 생성
const intervalOptions = Object.values(Interval);

const abcNotation = computed(() => {
  return `X:1\nL:1/4\nK:C\n${note1.value} ${note2.value}`;
});

const isCorrect = (answer: string) => answer === correctInterval.value;

const checkAnswer = (answer: string) => {
  userAnswer.value = answer;
};

const generateQuestion = () => {
  note1.value = getRandomNote();
  note2.value = getRandomNote();
  userAnswer.value = null;
};
</script>

<style scoped>
.interval-view {
  text-align: center;
}

.options {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 16px 0;
}

button {
  padding: 10px 16px;
  border: none;
  background-color: #ddd;
  cursor: pointer;
  font-size: 16px;
}

button.correct {
  background-color: #4caf50;
  color: white;
}

button.selected {
  border: 2px solid #000;
}
</style>
