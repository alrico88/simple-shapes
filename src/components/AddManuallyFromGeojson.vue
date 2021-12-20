<template lang="pug">
b-form.mt-3(@submit.prevent='createPolygonFromText')
  b-form-group(
    :invalid-feedback='error',
    valid-feedback='Valid GeoJSON'
  )
    b-form-textarea(
      v-model='geojson',
      :state='isValid',
      rows='4',
      max-rows='20',
      @drop.prevent="handleDrop",
      @dragover.prevent,
      placeholder="Paste a GeoJSON representation of a geometry here or drag and drop a file to this box"
    )
  b-button(
    type='submit',
    variant='success',
    :disabled="!hasEnteredText",
    block
  ) #[b-icon-plus] Add GeoJSON
</template>

<script>
import {validateGeoJSON} from '@/helpers/validators';
import {mapActions} from 'vuex';
import debounce from 'lodash/debounce';
import {readAsText} from 'promise-file-reader';
import ToastMixin, {toastVariants} from '../mixins/ToastMixin';

export default {
  name: 'AddManuallyFromGeojson',
  mixins: [ToastMixin],
  data() {
    return {
      geojson: '',
      isValid: null,
      error: '',
    };
  },
  computed: {
    hasEnteredText() {
      return this.geojson !== '';
    },
  },
  watch: {
    geojson(value) {
      this.validate(value);
    },
  },
  methods: {
    ...mapActions(['addPolygon']),
    createPolygonFromText() {
      const parsed = JSON.parse(this.geojson);
      this.getBasicGeometriesToAdd(parsed);
      this.$emit('done');
    },
    getBasicGeometriesToAdd(parsed) {
      const {type} = parsed;

      if (type === 'FeatureCollection') {
        parsed.features.forEach((feature) => {
          this.getBasicGeometriesToAdd(feature);
        });
      } else if (type === 'Feature') {
        this.addPolygon(parsed.geometry);
      } else if (type === 'GeometryCollection') {
        parsed.geometries.forEach((geometry) => {
          this.addPolygon(geometry);
        });
      } else {
        this.addPolygon(parsed);
      }
    },
    validate: debounce(function (value) {
      if (this.hasEnteredText) {
        try {
          validateGeoJSON(value);
          this.isValid = true;
        } catch (e) {
          this.isValid = false;
          this.error = e.message;
        }
      } else {
        this.isValid = null;
        this.error = '';
      }
    }, 500),
    async handleDrop(e) {
      try {
        this.geojson = await readAsText(e.dataTransfer.files[0]);
      } catch (_) {
        this.showToast('Error', 'Error loading file', toastVariants.ERROR);
      }
    },
  },
};
</script>
