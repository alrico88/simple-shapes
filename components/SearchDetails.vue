<template lang="pug">
table.w-full.border-collapse.bg-white.text-sm
  thead.bg-elevated
    tr
      th.border.border-default.px-2.py-1.text-left Property
      th.border.border-default.px-2.py-1.text-left Value
  tbody
    tr(v-for="(value, name) in place", :key="name")
      td.border.border-default.px-2.py-1 {{ name }}
      td.border.border-default.px-2.py-1.break-all {{ value }}
</template>

<script setup lang="ts">
const props = defineProps<{
  place: Record<string, unknown>;
}>();

watchEffect(() => {
  console.log(props.place);
});
</script>
