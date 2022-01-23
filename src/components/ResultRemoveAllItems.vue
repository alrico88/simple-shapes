<template lang="pug">
.alert.alert-danger.border-danger.mb-0
  .d-flex.align-items-center.justify-content-between
    div Remove all drawn features at once
    div
      button.btn.btn-danger.btn-sm(
        @click='() => store.clearPolygons()'
      ) #[icon-trash] Remove
</template>

<script setup lang="ts">
import { useMainStore } from '../store/main';
import IconTrash from '~icons/bi/trash';

const store = useMainStore();
</script>
