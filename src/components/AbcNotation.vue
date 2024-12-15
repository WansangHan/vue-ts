<template>
  <div class="abc_notation">
    <div ref="sheet"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, defineProps } from 'vue';
import abcjs from 'abcjs';

const props = defineProps<{
  notation: string
}>();

const sheet = ref<HTMLElement | null>(null);

const renderSheet = () => {
  if (sheet.value) {
    abcjs.renderAbc(sheet.value, props.notation, {
      scale: 1.5
    });
  }
};

onMounted(() => {
  renderSheet();
});

watch(() => props.notation, () => {
  renderSheet();
});
</script>

<style scoped>
.abc_notation {
  width: 100%;
  height: auto;
}
</style>
