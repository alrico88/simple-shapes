<template lang="pug">
.col.maxHeight.border-left
  .row.bg-blue.mb-3
    .col.py-3
      h2.mb-0 Simple Shapes
  settings
  .row
    .col.mb-1
      ZoomCenterTransition(:group='true')
        result-item(
          v-for='(polygon, index) of getPolygons',
          :key='"card_" + index',
          :polygon='polygon'
        )
      empty-state(:show='getPolygons.length === 0')
      ZoomCenterTransition
        result-copy-all-items(v-if='showMultipleActions.copy')
      ZoomCenterTransition
        result-remove-all-items.mt-2(v-if='showMultipleActions.delete')
  credits
  b-modal#manualAddModal(
    ref='manualAddModal',
    title='Add manually',
    :hide-footer="true"
  )
    add-manually(@done='closeAddModal')
</template>

<script>
import {mapGetters} from 'vuex';
import {ZoomCenterTransition} from 'vue2-transitions';
import EmptyState from '@/components/EmptyState.vue';
import ResultItem from '@/components/ResultItem.vue';
import ResultRemoveAllItems from '@/components/ResultRemoveAllItems.vue';
import ResultCopyAllItems from '@/components/ResultCopyAllItems.vue';
import AddManually from '@/components/AddManually.vue';
import Settings from '@/components/Settings.vue';
import Credits from '@/components/Credits.vue';

export default {
  components: {
    Credits,
    AddManually,
    ResultCopyAllItems,
    ResultRemoveAllItems,
    ResultItem,
    EmptyState,
    ZoomCenterTransition,
    Settings,
  },
  computed: {
    ...mapGetters(['getPolygons', 'getAsGeometryCollection', 'getPolygonArea']),
    showMultipleActions() {
      const len = this.getPolygons.length;

      return {
        copy: len > 0,
        delete: len > 1,
      };
    },
  },
  methods: {
    closeAddModal() {
      this.$refs.manualAddModal.hide();
    },
  },
};
</script>

<style scoped>
.maxHeight {
  max-height: 100vh;
  overflow-y: auto;
}
</style>
