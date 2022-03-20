<template lang="pug">
form.form.mt-3(@submit.prevent='createWktFromText')
  .form-group
    textarea.form-control.bg-white(
      v-model='enteredText',
      rows='4',
      max-rows='20',
      @drop.prevent="handleDrop",
      @dragover.prevent,
      placeholder="Enter the Well-Known-Text representation of a geometry here or drag and drop a file to this box"
    )
    .valid-feedback.d-block(v-if="isValid === true") Valid WKT
    .invalid-feedback.d-block(v-if="isValid === false") {{ error }}
  button.btn.btn-success.w-100(
    type='submit',
    :disabled="btnDisabled"
  ) #[icon-plus] Add WKT
</template>

<script setup lang="ts">
import { readAsText } from 'promise-file-reader';
import { computed, ref } from 'vue';
import { debouncedWatch } from '@vueuse/core';
import { replace } from 'lodash-es';
import { parseFromWK } from 'wkt-parser-helper';
import { validateWKT } from '../helpers/validators';
import { useMainStore } from '../store/main';
import IconPlus from '~icons/bi/plus';

const store = useMainStore();

const enteredText = ref('');
const wkt = computed(() => replace(enteredText.value, '"', ''));
const isValid = ref<boolean | null>(null);
const error = ref('');

const hasEnteredText = computed(() => wkt.value !== '');

function validate(str: string): void {
  if (hasEnteredText.value) {
    try {
      validateWKT(str);
      isValid.value = true;
      error.value = '';
    } catch (e: any) {
      isValid.value = false;
      error.value = e.message;
    }
  } else {
    isValid.value = null;
    error.value = '';
  }
}

debouncedWatch(wkt, validate, {
  debounce: 500,
});

const btnDisabled = computed(() => !hasEnteredText.value || !isValid.value);

const emit = defineEmits(['done']);

function createWktFromText() {
  const parsed = parseFromWK(wkt.value);

  store.addShapes(parsed);
  emit('done');
}

async function handleDrop(e: DragEvent): Promise<void> {
  if (e.dataTransfer) {
    enteredText.value = await readAsText(e.dataTransfer.files[0]);
  }
}
</script>
