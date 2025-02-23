<template>
  <div class="chord-view">
    <h1>코드를 맞춰보세요!</h1>
    <!-- 악보 표시 -->
    <AbcNotation :notation="abcNotation" />
    <!-- 피아노 건반 입력 -->
    <PianoKeys @note-selected="handleNoteSelection" />
    <!-- 코드 타입 선택 -->
    <div class="chord-type-options" v-if="selectedNotes.length > 0">
      <button
        v-for="(type, index) in possibleChordTypes"
        :key="index"
        @click="selectChordType(type)"
      >
        {{ type }}
      </button>
    </div>
    <!-- 결과 모달 -->
    <BaseModal v-if="showResultModal" @close="nextChord">
      <p>{{ modalText }}</p>
      <button @click="nextChord">다음</button>
    </BaseModal>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import AbcNotation from '@/components/AbcNotation.vue';
import PianoKeys from '@/components/PianoKeys.vue';
import BaseModal from '@/components/BaseModal.vue';
import { ChordType, getChordNotes } from '@/functions/music/Chord';
import { ChromaticNote } from '@/functions/music/Note';

export default {
  components: {
    AbcNotation,
    PianoKeys,
    BaseModal,
  },
  setup() {
    const currentChord = ref<{ root: ChromaticNote; type: ChordType } | null>(null);
    const abcNotation = ref('');
    const selectedNotes = ref<string[]>([]);
    const possibleChordTypes = ref<ChordType[]>([]);
    const showResultModal = ref(false);
    const modalText = ref('');

    // 🎲 랜덤 코드 생성
    const getRandomChord = () => {
      const notes = Object.values(ChromaticNote);
      const chordTypes = Object.values(ChordType);
      const randomRoot = notes[Math.floor(Math.random() * notes.length)] as ChromaticNote;
      const randomType = chordTypes[Math.floor(Math.random() * chordTypes.length)];
      return { root: randomRoot, type: randomType };
    };

    // 🎼 ABC Notation 변환 (코드 구성음 반영)
    const generateABCNotation = (chord: { root: ChromaticNote; type: ChordType }) => {
      const chordNotes = getChordNotes(chord.root, chord.type);
      return `X:1\nT:Quiz Chord\nM:4/4\nL:1/4\nK:C\n[V:1] "[${chord.root} ${chord.type}]" ${chordNotes.join(' ')} |`;
    };

    // 🎹 피아노에서 노트 선택 시 저장
    const handleNoteSelection = (note: string) => {
      if (!selectedNotes.value.includes(note)) {
        selectedNotes.value.push(note);
      }
      updatePossibleChordTypes();
    };

    // 🎵 선택한 노트로 가능한 코드 타입 필터링
    const updatePossibleChordTypes = () => {
      possibleChordTypes.value = Object.values(ChordType).filter(type =>
        checkIfNotesMatchChord(type)
      );
    };

    // 🎯 선택한 노트와 코드 일치 여부 확인
    const checkIfNotesMatchChord = (type: ChordType) => {
      if (!currentChord.value) return false;
      const correctNotes = getChordNotes(currentChord.value.root, type);
      return selectedNotes.value.every(note => correctNotes.includes(note));
    };

    // 🏆 정답 확인
    const selectChordType = (type: ChordType) => {
      if (currentChord.value && type === currentChord.value.type) {
        modalText.value = '정답입니다!';
      } else {
        modalText.value = '틀렸습니다. 다시 시도해보세요.';
      }
      showResultModal.value = true;
    };

    // 🔄 다음 문제
    const nextChord = () => {
      selectedNotes.value = [];
      showResultModal.value = false;
      currentChord.value = getRandomChord();
      abcNotation.value = generateABCNotation(currentChord.value);
    };

    onMounted(() => {
      nextChord();
    });

    return {
      abcNotation,
      selectedNotes,
      possibleChordTypes,
      showResultModal,
      modalText,
      handleNoteSelection,
      selectChordType,
      nextChord,
    };
  },
};
</script>

<style scoped>
.chord-view {
  text-align: center;
}
.chord-type-options {
  margin-top: 20px;
}
button {
  margin: 5px;
  padding: 10px 20px;
  font-size: 16px;
}
</style>
