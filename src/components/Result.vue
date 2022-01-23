<template lang="pug">
.col.maxHeight.border-left
  .row.bg-blue.mb-3
    .col.py-3
      h4.mb-0.fw-bolder Simple Shapes
  settings
  .row
    .col
      button.btn.btn-primary.btn-sm.w-100.py-2(
        @click='openAddModal'
      ) #[icon-plus] Add shape manually
  hr
  .row
    .col.mb-1
      result-item(
        v-for='(polygon, index) of polygons',
        :key='"card_" + index',
        :polygon='polygon'
      )
      empty-state.mb-2.auto-mb(:show='polygons.length === 0')
      result-copy-all-items.mb-2.auto-mb(v-if='showMultipleActions.copy')
      result-remove-all-items.mb-2.auto-mb(v-if='showMultipleActions.delete')
  credits
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import EmptyState from './EmptyState.vue';
import ResultItem from './ResultItem.vue';
import ResultRemoveAllItems from './ResultRemoveAllItems.vue';
import ResultCopyAllItems from './ResultCopyAllItems.vue';
import Settings from './Settings.vue';
import Credits from './Credits.vue';
import { useMainStore } from '../store/main';
import IconPlus from '~icons/bi/plus';
import { useModalsStore } from '../store/modals';

const store = useMainStore();
const modalsStore = useModalsStore();

const { polygons } = storeToRefs(store);
const { addModal } = storeToRefs(modalsStore);

const showMultipleActions = computed(() => {
  const len = polygons.value.length;

  return {
    copy: len > 0,
    delete: len > 1,
  };
});

function openAddModal() {
  addModal.value = true;
}
</script>

<style scoped>
.maxHeight {
  max-height: 100vh;
  overflow-y: auto;
}
</style>
