<template lang="pug">
b-table-simple.mb-0.bg-white(bordered, small)
  b-thead(variant="light")
    b-tr
      b-th Property
      b-th Value
  b-tbody
    b-tr(v-for="(value, name) in place", :key="name")
      b-td {{ name }}
      b-td {{ value }}
</template>

<script setup lang="ts">
const props = defineProps<{
  place: Record<string, unknown>;
}>();

watchEffect(() => {
  console.log(props.place);
});
</script>
