<template lang="pug">
codemirror.form-control(
  v-model='enteredText',
  line-numbers,
  @drop.prevent="handleDrop",
  @dragover.prevent,
  :style="style",
  :extensions="extensions"
)
</template>

<script setup lang="ts">
import { readAsText } from "promise-file-reader";
import { Codemirror } from "vue-codemirror";

const props = defineProps<{
  text: string;
}>();

const { style, extensions } = useCodeStyle();

const enteredText = useVModel(props, "text");

async function handleDrop(e: DragEvent): Promise<void> {
  if (e.dataTransfer) {
    enteredText.value = await readAsText(e.dataTransfer.files[0]);
  }
}
</script>
