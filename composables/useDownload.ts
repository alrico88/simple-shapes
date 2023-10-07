import { saveAs } from "file-saver";

export function useDownload(extension: Ref<string> | string) {
  const fileExtension = isRef(extension) ? extension : ref(extension);

  function downloadFile(content: string, fileName: string) {
    saveAs(
      new Blob([content], { type: "text/plain;charset=utf-8" }),
      `${fileName}.${fileExtension.value}`,
    );
  }

  return {
    downloadFile,
    extension,
  };
}
