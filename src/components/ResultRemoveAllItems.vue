<template lang="pug">
.alert.alert-danger.border-danger.mb-0
  justify-between(:gap="2")
    div Remove all drawn features at once
    div
      button.btn.btn-danger.btn-sm(
        @click='() => store.clearPolygons()'
      ) #[icon-trash] Remove
</template>

<script setup lang="ts">
import { useMainStore } from '../store/main';
import IconTrash from '~icons/bi/trash';
import JustifyBetween from './JustifyBetween.vue';

const store = useMainStore();
</script>
