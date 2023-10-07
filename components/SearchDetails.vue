<template lang="pug">
table.table.table-sm.bg-white.table-bordered.mb-0
  thead.thead-light
    tr
      th Property
      th Value
  tbody
    tr(v-for="(value, name) in place", :key="name")
      td {{ name }}
      td {{ value }}
</template>

<script setup lang="ts">
const props = defineProps<{
  place: Record<string, unknown>;
}>();
</script>
