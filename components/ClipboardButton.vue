<template lang="pug">
u-button.truncate(
  :color="copied ? 'success' : 'primary'",
  variant="outline",
  :size="size",
  :icon="copied ? 'bi:clipboard-check' : 'bi:clipboard-plus'",
  :label="text",
  @click="() => copy()"
)
</template>

<script lang="ts" setup>
const props = defineProps<{
  value: any;
  text?: string;
  size?: any;
}>();

const textToCopy = computed(() => {
  let toCopy;

  if (typeof props.value === "object") {
    toCopy = JSON.stringify(props.value);
  } else if (typeof props.value === "number") {
    toCopy = props.value.toString();
  } else {
    toCopy = props.value;
  }

  return toCopy;
});

const { copy, copied } = useClipboard({
  source: textToCopy,
});
</script>
