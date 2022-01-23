import { computed, Ref } from 'vue';
import { saveAs } from 'file-saver';

export function useDownload(format: Ref<string>) {
  const extension = computed(() => (format.value === 'wkt' ? 'txt' : 'geojson'));

  function downloadFile(content: string, fileName: string) {
    saveAs(new Blob([content], { type: 'text/plain;charset=utf-8' }), `${fileName}.${extension.value}`);
  }

  return {
    downloadFile,
    extension,
  };
}
