<template lang="pug">
.row
  .col
    b-alert.border-primary.mb-2.auto-mb(variant='primary', show)
      .row
        .col
          p.mb-2 Get all features as #[strong GeometryCollection]
      .row
        .col
          b-button.mr-2(
            variant='primary',
            size='sm',
            v-clipboard:copy='getAsGeometryCollection',
            v-clipboard:success='notifyClipSuccess',
            v-clipboard:error='notifyClipError'
          ) #[b-icon-clipboard] Copy to clipboard
          b-button(
            variant='primary',
            size='sm',
            @click='downloadFile("allFeatures", getAsGeometryCollection)'
          ) #[b-icon-download] Download as file
    b-alert.border-primary.mb-2.auto-mb(variant="primary", :show="showFeatureCollection")
      .row
        .col
          p.mb-2 Get all features as #[strong FeatureCollection]
      .row
        .col
          b-button.mr-2(
            variant='primary',
            size='sm',
            v-clipboard:copy='getAsFeatureCollection',
            v-clipboard:success='notifyClipSuccess',
            v-clipboard:error='notifyClipError'
          ) #[b-icon-clipboard] Copy to clipboard
          b-button(
            variant='primary',
            size='sm',
            @click='downloadFile("allFeatures", getAsFeatureCollection)'
          ) #[b-icon-download] Download as file
</template>

<script>
import DownloadMixin from '@/mixins/DownloadMixin';
import ClipboardMixin from '@/mixins/ClipboardMixin';
import {mapGetters, mapState} from 'vuex';

export default {
  name: 'ResultCopyAllItems',
  mixins: [DownloadMixin, ClipboardMixin],
  computed: {
    ...mapState(['format']),
    ...mapGetters(['getAsGeometryCollection', 'getAsFeatureCollection']),
    showFeatureCollection() {
      return this.format === 'geojson';
    },
  },
};
</script>
