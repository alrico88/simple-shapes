<template lang="pug">
u-separator.my-3(:label="title", :ui="{ label: 'font-bold uppercase text-default' }")
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>
