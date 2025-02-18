<template>
    <div v-if="visible" class="simple-modal">
      <div class="simple-modal-content">
        <slot></slot> <!-- 자유롭게 내용을 삽입 -->
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue';
  
  defineProps({
    visible: {
      type: Boolean,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  /* 모달의 전체 배경 스타일 */
  .simple-modal {
    display: block;
    position: fixed;
    z-index: 10; /* 모달이 피아노보다 앞에 표시되도록 높은 값 설정 */
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4); /* 반투명 배경 */
  }
  
  /* 모달 내부 콘텐츠 스타일 */
  .simple-modal-content {
    background-color: #fff;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #ccc;
    width: 70%; /* 기본 너비 설정 */
    border-radius: 8px; /* 모서리 둥글게 */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
    z-index: 11; /* 모달 내부 콘텐츠가 항상 위에 표시 */
  }
  </style>
  