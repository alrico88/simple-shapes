<template lang="pug">
.alert.alert-primary.border-primary.mb-0(
  v-show='show'
) #[icon-brush] Draw or add some shapes first
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
