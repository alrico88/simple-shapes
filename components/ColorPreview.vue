<template lang="pug">
.previewBlock.rounded(:style="{ backgroundColor: color }")
</template>

<script lang="ts" setup>
const props = defineProps<{
  color?: string;
}>();
</script>

<style scoped>
.previewBlock {
  height: 20px;
  width: 20px;
}
</style>
