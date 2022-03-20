<template lang="pug">
.hstack.align-items-center.justify-content-between(:class="`gap-${gap}`")
  slot
</template>

<script lang="ts" setup>
const props = defineProps<{
  gap: number
}>();
</script>