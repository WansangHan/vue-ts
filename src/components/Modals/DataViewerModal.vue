<template>
    <SimpleModal :visible="visible">
      <el-table :data="items" border style="width: 100%">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :formatter="column.formatter"
        />
      </el-table>
      <button @click="onClose" class="close-button">Close</button>
    </SimpleModal>
  </template>
  
  <script setup lang="ts">
  import SimpleModal from '@/components/Modals/SimpleModal.vue';
  import { defineProps } from 'vue';
  
  defineProps({
    items: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
  });
  </script>
  
  <style scoped>
  .close-button {
    display: block;
    margin: 20px auto 0;
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
  }
  
  .close-button:hover {
    background-color: #0056b3;
  }
  </style>
  