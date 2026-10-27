<template lang="pug">
u-app
  .flex.h-screen
    .h-screen.min-w-0.flex-1
      the-map
    div(class="h-screen w-1/2 border-l border-default md:w-5/12 lg:w-1/3")
      the-result
  u-modal(
    v-model:open="addModal",
    title="Add manually",
    :ui="{ content: 'max-w-3xl' }"
  )
    template(#body)
      add-manually(@done="addModal = false")
  u-modal(
    v-model:open="randomPointsModal.modal",
    title="Generate random points",
    @after:leave="randomPointsModal.wkt = null"
  )
    template(#body)
      get-random(
        v-if="randomPointsModal.wkt",
        :shape="randomPointsModal.wkt.wkt",
        :name="randomPointsModal.wkt.name",
        @close="randomPointsModal.modal = false"
      )
  u-modal(v-model:open="geohashesModal.modal", title="Find geohashes inside")
    template(#body)
      get-geohashes(
        v-if="geohashesModal.wkt",
        :shape="geohashesModal.wkt",
        :name="geohashesModal.name",
        @close="geohashesModal.modal = false"
      )
  u-modal(v-model:open="applyBufferModal.modal", title="Apply buffer to shape")
    template(#body)
      apply-buffer(
        :id="applyBufferModal.id",
        :shape="applyBufferModal.wkt",
        @close="applyBufferModal.modal = false"
      )
  u-slideover(v-model:open="searchInterfaceModal", side="right", title="Search")
    template(#body)
      the-search
</template>

<script setup lang="ts">
import { useModalsStore } from "./store/modals";

const store = useModalsStore();
const {
  addModal,
  searchInterfaceModal,
  randomPointsModal,
  applyBufferModal,
  geohashesModal,
} = storeToRefs(store);
</script>
