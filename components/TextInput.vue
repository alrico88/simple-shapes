<template lang="pug">
codemirror(
  v-model='enteredText',
  line-numbers,
  :style="style",
  :extensions="extensions"
)
</template>

<script setup lang="ts">
import { Codemirror } from "vue-codemirror";

const props = defineProps<{
  text: string;
}>();

const { style, extensions } = useCodeStyle();

const enteredText = useVModel(props, "text");
</script>
