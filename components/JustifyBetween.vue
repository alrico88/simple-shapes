<template lang="pug">
.flex.items-center.justify-between(:style="{ gap: `${gap * 0.25}rem` }")
  slot
</template>

<script lang="ts" setup>
const props = defineProps<{
  gap: number;
}>();
</script>
