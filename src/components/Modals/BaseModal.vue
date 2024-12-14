<template>
    <div v-if="visible" class="base-modal">
        <div class="base-modal-content">
            <button @click="Next" class="close-button">Next</button>
            <slot></slot>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    visible: {
        type: Boolean,
        required: true
    },
    buttonName:{
        type: String,
        require:true
    }
});

const emit = defineEmits(['next']);

const Next = () => {
    emit('next');
};
</script>

<style scoped>
/* 모달의 전체 배경을 설정하는 스타일 */
.base-modal {
    display: block; /* 모달을 블록 요소로 표시 */
    position: fixed; /* 화면의 특정 위치에 고정 */
    z-index: 1; /* 다른 요소들보다 앞에 표시되도록 z-index 설정 */
    left: 0; /* 화면의 왼쪽 끝에 위치 */
    top: 0; /* 화면의 위쪽 끝에 위치 */
    width: 100%; /* 화면의 전체 너비를 차지 */
    height: 100%; /* 화면의 전체 높이를 차지 */
    overflow: auto; /* 내용이 넘칠 경우 스크롤 가능 */
    background-color: rgba(0, 0, 0, 0.4); /* 배경색을 반투명한 검정색으로 설정 */
}

/* 모달의 내용 부분을 설정하는 스타일 */
.base-modal-content {
    background-color: #fefefe; /* 배경색을 흰색으로 설정 */
    margin: 15% auto; /* 위쪽에서 15% 아래로, 좌우 중앙에 위치 */
    padding: 20px; /* 내부 여백을 20px로 설정 */
    border: 1px solid #888; /* 테두리를 회색으로 설정 */
    width: 80%; /* 너비를 화면의 80%로 설정 */
}

/* 모달 닫기 버튼의 스타일 */
.close-button {
    color: #aaa; /* 글자 색상을 회색으로 설정 */
    float: right; /* 오른쪽 끝으로 정렬 */
    font-size: 28px; /* 글자 크기를 28px로 설정 */
    font-weight: bold; /* 글자를 굵게 설정 */
    cursor: pointer; /* 마우스 커서를 포인터로 변경 */
}

/* 닫기 버튼에 마우스를 올리거나 포커스가 갔을 때의 스타일 */
.close-button:hover,
.close-button:focus {
    color: black; /* 글자 색상을 검정색으로 변경 */
    text-decoration: none; /* 밑줄을 없앰 */
}
</style>
