<template lang="pug">
.size-5.rounded(:style="{ backgroundColor: color }")
</template>

<script lang="ts" setup>
const props = defineProps<{
  color?: string;
}>();
</script>
