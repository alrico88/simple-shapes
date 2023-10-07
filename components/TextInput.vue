<template lang="pug">
.max-input-height
  prism-editor.form-control.bg-white(
    :highlight="highlighter",
    v-model='enteredText',
    line-numbers,
    @drop.prevent="handleDrop",
    @dragover.prevent,
  )
</template>

<script setup lang="ts">
import { readAsText } from "promise-file-reader";
import { highlight, languages } from "prismjs";
import { PrismEditor } from "vue-prism-editor";

const props = defineProps<{
  text: string;
}>();

const enteredText = useVModel(props, "text");

async function handleDrop(e: DragEvent): Promise<void> {
  if (e.dataTransfer) {
    enteredText.value = await readAsText(e.dataTransfer.files[0]);
  }
}

function highlighter(code: string): string {
  return highlight(code, languages.json, "json");
}
</script>

<style lang="scss" scoped>
.max-input-height {
  max-height: 300px;
  overflow-y: auto;
}
</style>
