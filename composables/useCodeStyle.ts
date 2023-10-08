import { json } from "@codemirror/lang-json";

export function useCodeStyle() {
  return {
    extensions: [json()],
    style: {
      backgroundColor: "white",
      height: "100%",
      maxHeight: "300px",
    },
  };
}
