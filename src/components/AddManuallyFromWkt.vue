<template lang="pug">
form.form.mt-3(@submit.prevent='createWktFromText')
  .form-group
    .max-input-height
      text-input(v-model:text="enteredText")
    .form-text Enter the Well-Known-Text representation of a geometry here
      |  or drag and drop a file to the input
    .valid-feedback.d-block(v-if="isValid === true") Valid WKT
    .invalid-feedback.d-block(v-if="isValid === false") {{ error }}
  button.btn.btn-success.w-100(
    type='submit',
    :disabled="btnDisabled"
  ) #[icon-plus] Add WKT
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { debouncedWatch } from '@vueuse/core';
import { replace } from 'lodash-es';
import { parseFromWK } from 'wkt-parser-helper';
import { validateWKT } from '../helpers/validators';
import { useMainStore } from '../store/main';
import IconPlus from '~icons/bi/plus';
import TextInput from './TextInput.vue';

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
</script>

<style lang="scss" scoped>
.max-input-height {
  max-height: 300px;
  overflow-y: auto;
}
</style>
