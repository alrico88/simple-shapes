<template lang="pug">
div
  form.flex.flex-col.gap-4(@submit.prevent="generateGeohashes")
    u-form-field(
      label="Precision",
      description="Please bear in mind that computation will be made on your device and the browser may hang"
    )
      u-select.w-full(v-model="precision", :items="precisionOptions")
    u-form-field(label="Method")
      u-select.w-full(v-model="selectedMethod", :items="methods")
    u-button(
      block,
      type="submit",
      icon="tabler:play",
      label="Find geohashes inside shape",
      :disabled="inside.length > 0"
    )
  u-separator.my-4
  .flex.flex-col.gap-2
    u-alert(
      v-if="inside.length > 0",
      :title="`Found ${inside.length} geohashes`"
    )
    u-form-field(label="Output format")
      u-select.w-full(v-model="selectedOutput", :items="outputs")
    codemirror(
      :model-value="insideParsed",
      disabled,
      :extensions="extensions",
      :style="style"
    )
    .flex.gap-2
      u-button.justify-center(
        block,
        color="success",
        icon="mi:save",
        :label="`Download as ${filenameExtension.toUpperCase()}`",
        :disabled="inside.length === 0",
        @click="downloadList"
      )
      u-button.justify-center(
        block,
        color="neutral",
        :icon="copied ? 'tabler:copy-check-filled' : 'tabler:copy'",
        :label="copied ? 'Copied' : 'Copy to clipboard'",
        :disabled="inside.length === 0 || copied",
        @click="copy(insideParsed)"
      )
</template>

<script setup lang="ts">
import { toGeohashes, type HashMode } from "geohashcover";
import { wktToGeojson } from "wkt-parser-helper";
import { Codemirror } from "vue-codemirror";

const props = defineProps<{
  shape: string;
  name: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const precision = ref(6);
const precisionOptions = Array.from({ length: 8 }, (_, i) => i + 1);

const methods = ["intersect", "envelope", "insideOnly", "border"];
const selectedMethod = ref("intersect");

const outputs = ["list", "csv", "array"];
const selectedOutput = ref("csv");
const filenameExtension = computed(() => {
  switch (selectedOutput.value) {
    case "array":
      return "json";
    case "csv":
      return "csv";
    default:
      return "txt";
  }
});

const inside = shallowRef<string[]>([]);
const insideParsed = computed(() => {
  switch (selectedOutput.value) {
    case "csv":
      return inside.value.join("\n");
    case "list":
      return inside.value.join(",");
    default:
      return JSON.stringify(inside.value);
  }
});

watch([selectedMethod, precision], () => {
  inside.value = [];
});

const loading = ref(false);

function generateGeohashes() {
  try {
    loading.value = true;

    inside.value = toGeohashes(wktToGeojson(props.shape), {
      precision: precision.value,
      hashMode: selectedMethod.value as HashMode,
    });
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

const { downloadFile } = useDownload(filenameExtension);

function downloadList() {
  downloadFile(insideParsed.value, `geohashes_in_${props.name}`);
}

const { style, extensions } = useCodeStyle();

const { copy, copied } = useClipboard();
</script>
