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
        <ul>
          <li v-for="item in scaleQuizItems" :key="item.id">{{ item }}</li>
        </ul>
      </BaseModal>
    </div>
  
    <div v-else>Loading...</div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import AbcNotation from '@/components/AbcNotation.vue';
  import BaseModal from '@/components/Modals/BaseModal.vue';
  import PianoKeys from '@/components/PianoKeys.vue';
  import { MajorScaleToAbcNotation, getRandomMajorScale } from '@/functions/music/Scale';
  import { useStore } from '@/store/modules/indexedDB';
  
  // 상태 변수
  const loading = ref(true);
  const abcNotation = ref('');
  const formattedElapsedTime = ref('0.0');
  const showResultModal = ref(false);
  const showDetailModal = ref(false);
  const modalText = ref('');
  const elapsedTime = ref(0);
  
  let intervalId = null;
  let answer = null;
  let quizStartTime = null;
  
  const store = useStore();
  const scaleQuizItems = ref([]);
  
  // 컴포넌트 마운트 시 초기화
  onMounted(async () => {
    try {
      await fetchData();
      MakeQuiz();
      intervalId = setInterval(updateElapsedTime, 100);
      scaleQuizItems.value = await store.dispatch('getAllItems');
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
  
  // 데이터 초기화
  async function fetchData() {
    // 추가 데이터 초기화가 필요한 경우 작성
  }
  
  // 경과 시간 업데이트
  const updateElapsedTime = () => {
    elapsedTime.value += 0.1;
    formattedElapsedTime.value = elapsedTime.value.toFixed(1);
  };
  
  // 퀴즈 생성
  function MakeQuiz() {
    answer = getRandomMajorScale();
    abcNotation.value = MajorScaleToAbcNotation(answer) + "\n|";
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
    console.log('Wrong answer!');
  }
  
  // 다음 문제로 이동
  function OnClickNextInModal() {
    showResultModal.value = false;
    MakeQuiz();
  }
  </script>
  