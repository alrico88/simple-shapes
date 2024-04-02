<template lang="pug">
.card.rounded(v-show="show")
  .card-body.text-center #[icon(name="bi:brush")] Draw or add some shapes first
</template>

<script setup lang="ts">
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
});
</script>
