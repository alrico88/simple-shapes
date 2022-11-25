<template lang='pug'>
.hstack.gap-2.align-items-center.my-3
  .flex-grow-1
    hr
  .text-uppercase.fw-bold {{ title }}
  .flex-grow-1
    hr
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
}>();
</script>
