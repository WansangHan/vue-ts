<template>
    <div>
        elapsed : {{ formattedElapsedTime }}, best : {{  }}
        <button
        @click="showDetailModal=true"
        >
            detail
        </button>
    </div>
    <AbcNotation :notation="abcNotation" />
    <div class="button-container">
        <button 
        v-for="majorScale in majorScales" 
        :key="majorScale.scale" 
        @click="OnClickQuizAnswer(majorScale)"
        class="scale-button"
        :class="{ 'quiz_fail': majorScale.isClicked }"
        >
        {{ majorScale.text }}
        </button>
    </div>
    <BaseModal
    :visible="showResultModal"
    @next="OnClickNextInModal()">
        {{ modalText }}
    </BaseModal>
    <BaseModal :visible="showDetailModal" @next="showDetailModal=false">
        <ul>
            <li
            v-for="item in scaleQuizItems"
            :key="item.id"
            >{{ item }}</li>
        </ul>
    </BaseModal>
</template>

<script setup lang="ts">

import { ref, onMounted, onUnmounted, computed } from 'vue';
import AbcNotation from '@/components/AbcNotation.vue';
import BaseModal from '@/components/BaseModal.vue';
import { MajorScale, MajorScaleToAbcNotation, getRandomMajorScale } from '@/functions/music/Scale';
import { useStore, ScaleQuizItem } from '@/store/modules/indexedDB'

const abcNotation = ref('');

const majorScales = ref([
    { scale: MajorScale.C,      text: "C Major",        isClicked: false },
    { scale: MajorScale.C_D,    text: "C# / Db Major",  isClicked: false },
    { scale: MajorScale.D,      text: "D Major",        isClicked: false },
    { scale: MajorScale.D_E,    text: "D# / Eb Major",  isClicked: false },
    { scale: MajorScale.E,      text: "E Major",        isClicked: false },
    { scale: MajorScale.F,      text: "F Major",        isClicked: false },
    { scale: MajorScale.F_G,    text: "F# / Gb Major",  isClicked: false },
    { scale: MajorScale.G,      text: "G Major",        isClicked: false },
    { scale: MajorScale.G_A,    text: "G# / Ab Major",  isClicked: false },
    { scale: MajorScale.A,      text: "A Major",        isClicked: false },
    { scale: MajorScale.A_B,    text: "A# / Bb Major",  isClicked: false },
    { scale: MajorScale.B,      text: "B Major",        isClicked: false },
])

// 답
let answer: MajorScale
// 문제마다 문제를 틀린 적이 있는 지 확인한다.
let isFailedAnswer: boolean;

// 문제가 만들어진 시간
let quizStartTime: number

// 모달 보여줄 지 여부
let showResultModal = ref(false)
let showDetailModal = ref(false)

// 모달에 보여질 텍스트
let modalText = ref('')

// 문제 푸는데에 걸린 시간을 측정하기 위한 변수들
const elapsedTime = ref(0);
const formattedElapsedTime = ref('0.0');
let intervalId: number | null = null;

// indexedDB로부터 읽은 데이터들
const store = useStore();
let scaleQuizItems = computed(() => store.state.scaleQuizItems)

onMounted(async () => {
    intervalId = setInterval(updateElapsedTime, 100) as unknown as number;
    MakeQuiz();
    await store.dispatch('getAllItems')

    console.log(scaleQuizItems.value);
});

onUnmounted(() => {
    if (intervalId !== null) {
        clearInterval(intervalId);
    }
});

// setInterval에 의해 0.1초마다 호출되는 함수
const updateElapsedTime = () => {
    // 0.1초를 더해준다.
    elapsedTime.value += 0.1;
    // 소수점 첫 번째까지만 화면에 출력한다.
    formattedElapsedTime.value = elapsedTime.value.toFixed(1);
};

// Major Scale 문제를 내준다.
function MakeQuiz()
{
    // 유저가 맞출 Scale을 랜덤으로 만든다.
    answer = getRandomMajorScale()

    console.log(MajorScale[answer])

    // Key로 abc 방식의 문자열을 얻는다.
    let majorScaleABCNotation = MajorScaleToAbcNotation(answer)
    abcNotation.value = majorScaleABCNotation + "\n|"

    // 문제를 풀기 시작한 시간을 저장한다.
    quizStartTime = performance.now()

    // 시간을 0초로 만들어 새로 시간을 잰다.
    elapsedTime.value = 0
    // 문제를 틀린 적 없는 상태로 되돌린다.
    isFailedAnswer = false;
}

// 문제를 틀려 색이 빨간색으로 바뀐 버튼이 있을 때,
// 전부 클릭 안된 상태로 되돌리는 함수
function ChangeAllButtonColorToWhite()
{
    // 화면상의 12개 버튼들
    for(let ms of majorScales.value)
    {
        if (ms.isClicked == true)
        {
            // 클릭 된 건 다시 클릭 안된 상태로 되돌린다.
            ms.isClicked = false
        }
    }
}

// 정답 입력 시 콜백
function OnClickQuizAnswer(selected:any)
{
    let selectedAnswer:MajorScale = selected.scale;

    // 정답
    if (answer == selectedAnswer)
    {
        OnAnswerCorrect()
    }
    else
    {
        selected.isClicked = true
        isFailedAnswer = true
    }
}

// 정답을 골랐을 떄 호출되는 함수
async function OnAnswerCorrect()
{
    // 문제 푸는데에 걸린 시간을 구한다.
    let during:number = performance.now() - quizStartTime;

    // 초 단위로 수정한다.
    let sec = (during / 1000).toFixed(1);

    // 모달상에 걸린 시간을 띄운다.
    modalText.value = `during : ${sec} sec`

    // 모달을 띄운다.
    showResultModal.value = true

    let item: ScaleQuizItem = {
        scale: answer,
        saveTime: Date.now(),
        isSolvedCorrectly: isFailedAnswer,
        during: during,
    }

    await store.dispatch('addScaleQuizStore', item)

    scaleQuizItems.value.push(item)
}

// model에서 next 버튼을 눌렀을 때 호출되는 함수
function OnClickNextInModal()
{
    showResultModal.value = false;

    // 문제를 틀려 빨간색으로 바뀐 버튼이 있다면, 다시 되돌린다.
    ChangeAllButtonColorToWhite()

    // 다음 문제를 낸다.
    MakeQuiz();
}

</script>

<style scoped>
.button-container {
  display: grid;  /* 그리드 컨테이너로 설정 */
  grid-template-columns: repeat(2, 1fr);  /* 두 개의 동일한 너비의 열 생성 */
  gap: 10px;  /* 버튼 사이의 간격 설정 (선택 사항) */
}

.scale-button {
  margin-bottom: 10px; /* 버튼 사이의 간격 */
  width: 100%; /* 버튼의 너비를 컨테이너의 전체 너비로 설정 */
  text-align: middle; /* 버튼 내 텍스트를 왼쪽 정렬 */
  padding: 10px; /* 버튼 내부의 여백 */
}

.quiz_fail {
    background-color: red;
    color: blue;
}

</style>