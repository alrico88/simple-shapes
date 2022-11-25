<template lang="pug">
.card.rounded(v-show='show')
  .card-body.text-center #[icon-brush] Draw or add some shapes first
</template>

<script setup lang="ts">
import IconBrush from '~icons/bi/brush';

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
</script>
