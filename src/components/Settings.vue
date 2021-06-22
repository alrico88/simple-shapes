<template lang="pug">
  .row.mb-2
    .col
      b-form(@submit="preventSubmit")
        .form-row.row-cols-md-2
          .col
            b-form-group.mb-0(label="Format")
              b-button-group.d-flex(size="sm")
                b-button.w-100(v-for="item of formats" :key="item.value", @click="selectedFormat = item.value" , variant="secondary", :class="{active: selectedFormat === item.value}") {{ item.text }}
          .col
            b-form-group.mb-0(label="Add manually")
              b-button(@click='openAddModal', variant='secondary', size='sm', block) #[b-icon-plus] Add shape
</template>

<script>
import {mapState, mapMutations} from 'vuex';

export default {
  name: 'Settings',
  data() {
    return {
      formats: [
        {
          text: 'WKT',
          value: 'wkt',
        }, {
          text: 'GeoJSON',
          value: 'geojson',
        },
      ],
    };
  },
  computed: {
    ...mapState(['format']),
    selectedFormat: {
      get() {
        return this.format;
      },
      set(value) {
        this.changeFormat(value);
      },
    },
  },
  methods: {
    ...mapMutations(['changeFormat']),
    openAddModal() {
      this.$bvModal.show('manualAddModal');
    },
    preventSubmit(e) {
      e.preventDefault();
    },
  },
};
</script>
