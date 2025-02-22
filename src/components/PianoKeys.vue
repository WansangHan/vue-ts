<template>
  <div class="piano-container">
    <div class="keys">
      <!-- 흰 건반 -->
      <button
        v-for="key in whiteKeys"
        :key="'white-' + key.scale"
        class="white-key scale-button"
        :class="{ 'white-fail': key?.isClicked }"
        @click="onClickKey(key)"
      >
        {{ key.text }}
      </button>

      <!-- 검은 건반 -->
      <button
        v-for="key in filteredBlackKeys"
        :key="'black-' + key.scale"
        class="black-key scale-button"
        :style="{ left: `${key.left}px` }"
        :class="{ 'black-fail': key?.isClicked }"
        @click="onClickKey(key)"
      >
        {{ key.text }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { ChromaticNote } from '@/functions/music/Note';

// Props
const props = defineProps({
  answer: {
    type: Number,
    required: true,
  },
});

// Emits
const emit = defineEmits(['onAnswerCorrect', 'onAnswerFail']);

// 흰 건반 데이터 정의
const whiteKeys = ref([
  { scale: ChromaticNote.C, text: "C", isClicked: false },
  { scale: ChromaticNote.D, text: "D", isClicked: false },
  { scale: ChromaticNote.E, text: "E", isClicked: false },
  { scale: ChromaticNote.F, text: "F", isClicked: false },
  { scale: ChromaticNote.G, text: "G", isClicked: false },
  { scale: ChromaticNote.A, text: "A", isClicked: false },
  { scale: ChromaticNote.B, text: "B", isClicked: false },
]);

// 검은 건반 데이터 정의 (left 값 포함)
const rawBlackKeys = [
  { scale: ChromaticNote.C_D, text: "C#", isClicked: false, left: 27 },
  { scale: ChromaticNote.D_E, text: "D#", isClicked: false, left: 69 },
  { isEmpty: true }, // E와 F 사이
  { scale: ChromaticNote.F_G, text: "F#", isClicked: false, left: 153 },
  { scale: ChromaticNote.G_A, text: "G#", isClicked: false, left: 195 },
  { scale: ChromaticNote.A_B, text: "A#", isClicked: false, left: 237 },
  { isEmpty: true }, // B와 C 사이
];

// 검은 건반 필터링된 데이터
const filteredBlackKeys = computed(() =>
  rawBlackKeys.filter(key => !key.isEmpty)
);

// 키 클릭 처리
function onClickKey(key) {
  if (!key) {
    console.warn('Invalid key clicked:');
    return;
  }

  if (key.scale === props.answer) {
    emit('onAnswerCorrect');
  } else {
    key.isClicked = true; // 클릭 상태 변경
    whiteKeys.value = [...whiteKeys.value]; // 반응성 강제 갱신
    emit('onAnswerFail');
  }
}
</script>

<style scoped>
.piano-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.keys {
  position: relative;
  width: fit-content;
  height: 120px;
}

.white-key {
  position: relative;
  width: 40px;
  height: 120px;
  margin: 0;
  background: white;
  border: 1px solid #ddd;
  z-index: 1; /* 흰 건반이 아래 */
  color: black; /* 흰 건반의 텍스트 색상 */
  text-align: center;
  padding-top: 95px; /* 텍스트를 아래쪽으로 이동 */
  font-size: 12px; /* 텍스트 크기 조정 */
  box-sizing: border-box;
}

.black-key {
  position: absolute;
  width: 30px;
  height: 80px;
  background: black;
  border: 1px solid #333;
  z-index: 2; /* 검은 건반이 위로 올라옴 */
  color: white; /* 검은 건반의 텍스트 색상 */
  text-align: center;
  line-height: 80px; /* 텍스트를 가운데로 정렬 */
  font-size: 12px; /* 텍스트 크기 조정 */
  box-sizing: border-box;
}

.white-fail {
  background: #ffcccb !important; /* 흰 건반 오답 색상 */
}

.black-fail {
  background: #e57373 !important; /* 검은 건반 오답 색상 */
}
</style>
