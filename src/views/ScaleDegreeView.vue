<script setup>
import { ref } from 'vue';
import { ChromaticNote } from '@/functions/music/Note';
import { getRandomScale, getRandomNoteFromScale, getNoteDegree } from '@/functions/music/Scale';

const currentScale = ref(getRandomScale());
const currentNote = ref(getRandomNoteFromScale(currentScale.value));
const userAnswer = ref('');
const feedback = ref('');
const feedbackClass = ref('');

/**
 * 정답 체크 함수
 */
const checkAnswer = () => {
  const correctDegree = getNoteDegree(currentNote.value, currentScale.value);
  if (parseInt(userAnswer.value) === correctDegree) {
    feedback.value = '정답입니다!';
    feedbackClass.value = 'text-green-500';
  } else {
    feedback.value = `틀렸습니다. 정답은 ${correctDegree} 번째 음입니다.`;
    feedbackClass.value = 'text-red-500';
  }
};

/**
 * 다음 문제로 넘어가는 함수
 */
const nextQuestion = () => {
  currentScale.value = getRandomScale();
  currentNote.value = getRandomNoteFromScale(currentScale.value);
  userAnswer.value = '';
  feedback.value = '';
  feedbackClass.value = '';
};

/**
 * 음을 보기 좋게 변환하는 함수 (이명동음 포함)
 */
const formatNote = (note) => {
  const noteMap = {
    [ChromaticNote.C]: 'C',
    [ChromaticNote.C_D]: 'C#/Db',
    [ChromaticNote.D]: 'D',
    [ChromaticNote.D_E]: 'D#/Eb',
    [ChromaticNote.E]: 'E',
    [ChromaticNote.F]: 'F',
    [ChromaticNote.F_G]: 'F#/Gb',
    [ChromaticNote.G]: 'G',
    [ChromaticNote.G_A]: 'G#/Ab',
    [ChromaticNote.A]: 'A',
    [ChromaticNote.A_B]: 'A#/Bb',
    [ChromaticNote.B]: 'B',
  };
  return noteMap[note] || note;
};
</script>
