<template lang="pug">
b-alert.text-center(:model-value="show", variant="light")
  .vstack.gap-2
    div
      icon(name="gis:extent-alt", size="40")
    div Draw or add some shapes first
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
}>();
</script>
