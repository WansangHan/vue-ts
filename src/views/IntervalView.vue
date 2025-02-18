<template>
  <div>
    <AbcNotation :notation="abcNotation" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import AbcNotation from '@/components/AbcNotation.vue';
import { ChromaticNote, FullRangeNote, convertToAbcNotation, getChromaticNoteDistance, getFullRangeNoteByChromaticNote, getRandomChromaticNote } from '@/functions/music/Note';

export default defineComponent({
  components: {
    AbcNotation
  },
  setup() {
    const abcNotation = ref('');

    onMounted(() => {
      const minRange = FullRangeNote.A3;
      const maxRange = FullRangeNote.A5;

      const lower = getRandomChromaticNote();
      const higher = getRandomChromaticNote();

      console.log(`lower : ${ChromaticNote[lower]}`);
      console.log(`higher : ${ChromaticNote[higher]}`);

      let selectedLowers = getFullRangeNoteByChromaticNote(lower);

      // minRange보다 큰 FullRangeNote만 추린다.
      selectedLowers = selectedLowers.filter((e) => minRange <= e);

      const distanceBetweenLowerHigher = getChromaticNoteDistance(lower, higher);

      // minRange보다 작은 FullRangeNote만 추린다.
      selectedLowers = selectedLowers.filter((e) => maxRange >= e + distanceBetweenLowerHigher);

      // selectedLowers의 첫 번째 값으로 우선 출력
      abcNotation.value = "[";
      abcNotation.value += convertToAbcNotation(selectedLowers[0]);
      abcNotation.value += convertToAbcNotation(selectedLowers[0] + distanceBetweenLowerHigher);
      abcNotation.value += "]";
    });

    return {
      abcNotation
    };
  }
});
</script>