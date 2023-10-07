<template lang="pug">
.d-flex.flex-column.h-100
  .bg-blue.mb-3
    .container-fluid
      .row
        .col.py-3
          .hstack.gap-2.align-items-center.justify-content-between
            h4.mb-0.fw-bolder Simple Shapes
            .hstack.gap-2
              b-button(
                variant="secondary",
                @click="openSearchInterface"
              ) #[icon-search] Search
              b-button(
                variant="primary",
                @click='openAddModal'
              ) #[icon-plus] Add shape manually
  .container-fluid
    .row
      .col
        settings
        map-actions
        divider-line(:title="`Shapes (${polygons.length})`")
  .container-fluid.h-100.overflow-y-auto.flex-grow-1
    .row.g-2
      .col
        result-item(
          v-for='polygon of currentPageItems',
          :key='polygon.id',
          :polygon='polygon'
        )
        empty-state.mb-2.auto-mb(:show='polygons.length === 0')
        b-pagination(
          v-if="showPagination"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
        )
  .py-3.border-top.border-2.bg-white
    .container-fluid
      .row
        .col
          result-copy-all-items.mb-2.auto-mb(v-if='showMultipleActions.copy')
          credits
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePagination } from '../composables/usePagination';
import EmptyState from './EmptyState.vue';
import ResultItem from './ResultItem.vue';
import ResultCopyAllItems from './ResultCopyAllItems.vue';
import Settings from './Settings.vue';
import Credits from './Credits.vue';
import { useMainStore } from '../store/main';
import IconPlus from '~icons/bi/plus';
import IconSearch from '~icons/bi/search';
import { useModalsStore } from '../store/modals';
import MapActions from './MapActions.vue';
import DividerLine from './DividerLine.vue';

const store = useMainStore();
const modalsStore = useModalsStore();

const { polygons } = storeToRefs(store);
const { addModal, searchInterface } = storeToRefs(modalsStore);

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

function openSearchInterface() {
  searchInterface.value = true;
}

const {
  currentPage,
  currentPageItems,
  totalRows,
  perPage,
  showPagination,
} = usePagination(polygons, {
  perPage: 20,
  resetOnChange: true,
});
</script>

<style lang="scss" scoped>
.maxHeight {
  max-height: 100vh;
  overflow-y: auto;
}
</style>
