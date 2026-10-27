<template lang="pug">
.rounded-md.border.border-default.bg-default.p-4.text-center(v-if="show")
  .flex.flex-col.items-center.gap-2
    u-icon.size-10(name="gis:extent-alt")
    div Draw or add some shapes first
</template>

<script setup lang="ts">
const props = defineProps<{
  show: boolean;
}>();
</script>
