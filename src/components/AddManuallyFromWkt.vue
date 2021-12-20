<template lang="pug">
b-form.mt-3(@submit.prevent='createWktFromText')
  b-form-group(
    :invalid-feedback='error',
    valid-feedback='Valid WKT'
  )
    b-form-textarea(
      v-model='wkt',
      :state='isValid',
      rows='4',
      max-rows='20',
      @drop.prevent="handleDrop",
      @dragover.prevent,
      placeholder="Enter the Well-Known-Text representation of a geometry here or drag and drop a file to this box"
    )
  b-button(
    type='submit',
    variant='success',
    :disabled="!hasEnteredText",
    block
  ) #[b-icon-plus] Add WKT
</template>

<script>
import {mapActions} from 'vuex';
import {validateWKT} from '@/helpers/validators';
import debounce from 'lodash/debounce';
import {readAsText} from 'promise-file-reader';
import ToastMixin, {toastVariants} from '../mixins/ToastMixin';

export default {
  name: 'AddManuallyFromWkt',
  mixins: [ToastMixin],
  data() {
    return {
      wkt: '',
      isValid: null,
      error: '',
    };
  },
  computed: {
    hasEnteredText() {
      return this.wkt !== '';
    },
  },
  watch: {
    wkt(value) {
      this.validate(value);
    },
  },
  methods: {
    ...mapActions(['addWkt']),
    createWktFromText() {
      this.addWkt(this.wkt);
      this.$emit('done');
    },
    validate: debounce(function (value) {
      let error, valid;
      if (this.hasEnteredText) {
        try {
          validateWKT(value);
          valid = true;
          error = '';
        } catch (e) {
          valid = false;
          error = e.message;
        }
      } else {
        valid = null;
        error = '';
      }

      this.isValid = valid;
      this.error = error;
    }, 500),
    async handleDrop(e) {
      try {
        this.wkt = await readAsText(e.dataTransfer.files[0]);
      } catch (_) {
        this.showToast('Error', 'Error loading file', toastVariants.ERROR);
      }
    },
  },
};
</script>
