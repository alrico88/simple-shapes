<template lang="pug">
b-button.text-truncate(
  :variant="btnVariant",
  :size="size",
  @click="() => copy()"
)
  icon(name="bi:clipboard-plus", v-show="!copied")
  icon(name="bi:clipboard-check", v-show="copied")
  |
  | {{ text }}
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

const btnVariant = computed(() =>
  copied.value ? "success" : "outline-primary"
);
</script>
