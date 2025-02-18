<template>
    <div class="chord-view">
      <h1>코드를 맞춰보세요!</h1>
      
      <!-- 악보 표시 -->
      <AbcNotation :notation="abcNotation" />
      
      <!-- 피아노 건반 입력 -->
      <PianoKeys @note-selected="handleNoteSelection" />
      
      <!-- 코드 타입 선택 -->
      <div class="chord-type-options" v-if="selectedNotes.length > 0">
        <button v-for="(type, index) in chordTypes" :key="index" @click="selectChordType(type)">
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
  import BaseModal from '@/components/BaseModal.vue';
  import PianoKeys from '@/components/PianoKeys.vue';
  import { ChromaticNote } from '@/functions/music/Note';
  import { ChordType } from '@/functions/music/Chord';
  
  export default {
    components: {
      AbcNotation,
      BaseModal,
      PianoKeys,
    },
    setup() {
      const abcNotation = ref('');
      const selectedNotes = ref<ChromaticNote[]>([]);
      const chordTypes = ref<ChordType[]>(Object.values(ChordType));
      const selectedChordType = ref<ChordType | ''>('');
      const correctChord = ref('');
      const showResultModal = ref(false);
      const modalText = ref('');
      
      const generateChord = () => {
        const chords = Object.values(ChromaticNote);
        const types = Object.values(ChordType);
        const randomChord = chords[Math.floor(Math.random() * chords.length)];
        const randomType = types[Math.floor(Math.random() * types.length)];
        correctChord.value = `${randomChord} ${randomType}`;
        abcNotation.value = `X:1\nT:Guess the Chord\nK:C\n${correctChord.value}`;
      };
      
      const handleNoteSelection = (note: ChromaticNote) => {
        if (!selectedNotes.value.includes(note)) {
          selectedNotes.value.push(note);
        }
      };
      
      const selectChordType = (type: ChordType) => {
        selectedChordType.value = type;
        checkAnswer();
      };
      
      const checkAnswer = () => {
        const userChord = `${selectedNotes.value.join(' ')} ${selectedChordType.value}`;
        if (userChord === correctChord.value) {
          modalText.value = '정답입니다!';
        } else {
          modalText.value = `오답입니다. 정답은 ${correctChord.value} 입니다.`;
        }
        showResultModal.value = true;
      };
      
      const nextChord = () => {
        showResultModal.value = false;
        selectedNotes.value = [];
        selectedChordType.value = '';
        generateChord();
      };
      
      onMounted(() => {
        generateChord();
      });
      
      return {
        abcNotation,
        selectedNotes,
        chordTypes,
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
    padding: 10px 15px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  