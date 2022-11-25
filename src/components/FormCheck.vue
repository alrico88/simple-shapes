<template lang='pug'>
.form-check.mb-0
  input.form-check-input(
    :id="id",
    type="checkbox",
    v-model="val"
  )
  label.form-check-label(:for="id") {{ props.label }}
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import shortId from 'shortid';

const id = shortId();

const props = defineProps<{
  modelValue: boolean,
  label: string
}>();

const val = useVModel(props, 'modelValue');
</script>
