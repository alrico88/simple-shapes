<template lang="pug">
.container-fluid
  .row
    .col
      b-form(@submit.prevent="generateGeohashes")
        .vstack.gap-3
          b-form-group(
            label="Precision",
            description="Please bear in mind that computation will be made on your device and the browser may hang"
          )
            b-form-select(v-model="precision")
              b-form-select-option(v-for="i in 8", :value="i") {{ i }}
          b-form-group(label="Method")
            b-form-select(v-model="selectedMethod", :options="methods")
          b-button.w-100(
            type="submit",
            variant="primary",
            :disabled="inside.length > 0"
          ) #[icon(name="tabler:play")] Find geohashes inside shape
      hr.my-4
      .vstack.gap-2
        b-alert.mb-0(:model-value="inside.length > 0") Found {{ inside.length }} geohashes
        b-form-group(label="Output format")
          b-form-select(v-model="selectedOutput", :options="outputs")
        div
          codemirror(
            :model-value="insideParsed",
            disabled,
            :extensions="extensions",
            :style="style"
          )
        .hstack.gap-2
          b-button.w-100(
            :disabled="inside.length === 0",
            @click="downloadList",
            variant="success"
          ) #[icon(name="mi:save")] Download as {{ filenameExtension.toUpperCase() }}
          b-button.w-100(
            :disabled="inside.length === 0 || copied",
            variant="secondary",
            @click="copy(insideParsed)"
          )
            icon(:name="copied ? 'tabler:copy-check-filled' : 'tabler:copy'")
            |
            | {{ copied ? "Copied" : "Copy to clipboard" }}
</template>

<script setup lang="ts">
import { shape2geohash } from "shape2geohash";
import { parseFromWK } from "wkt-parser-helper";
import { Codemirror } from "vue-codemirror";

const props = defineProps<{
  shape: string;
  name: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const precision = ref(6);

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

const inside = shallowRef([]);
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

async function generateGeohashes() {
  try {
    loading.value = true;

    inside.value = await shape2geohash(parseFromWK(props.shape), {
      precision: precision.value,
      hashMode: selectedMethod.value,
      allowDuplicates: false,
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
