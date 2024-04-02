<template lang="pug">
codemirror(
  v-model="text",
  line-numbers,
  :style="style",
  :extensions="extensions"
)
</template>

<script setup lang="ts">
import { Codemirror } from "vue-codemirror";

const text = defineModel<string>("text");

const { style, extensions } = useCodeStyle();
</script>
