<template lang="pug">
.flex.h-full.flex-col
  .mb-3.bg-brand-100.px-3.py-3
    .flex.items-center.justify-between.gap-2
      h4.text-lg.font-extrabold Simple Shapes
      .flex.gap-2
        u-button(
          color="neutral",
          variant="outline",
          icon="i-lucide-search",
          label="Search",
          @click="openSearchInterface"
        )
        u-button(
          icon="i-lucide-plus",
          label="Add shape",
          @click="openAddModal"
        )
  .px-3
    the-settings
    map-actions
    divider-line(:title="`Shapes (${polygons.length})`")
  .min-h-0.flex-1.overflow-y-auto.px-3.py-1
    result-item(
      v-for="polygon of currentPageItems",
      :key="polygon.id",
      :polygon="polygon"
    )
    empty-state.mb-2.auto-mb(:show="polygons.length === 0")
    u-pagination(
      v-if="showPagination",
      v-model:page="currentPage",
      :total="totalRows",
      :items-per-page="perPage"
    )
  .border-t-2.border-default.bg-white.px-3.py-3
    result-copy-all-items.mb-2.auto-mb(v-if="showMultipleActions.copy")
    the-credits
</template>

<script setup lang="ts">
import { useMainStore } from "../store/main";
import { useModalsStore } from "../store/modals";

const store = useMainStore();
const modalsStore = useModalsStore();

const { polygons } = storeToRefs(store);
const { addModal, searchInterfaceModal } = storeToRefs(modalsStore);

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
  searchInterfaceModal.value = true;
}

const { currentPage, currentPageItems, totalRows, perPage, showPagination } =
  usePagination(polygons, {
    perPage: 20,
    resetOnChange: true,
  });
</script>
