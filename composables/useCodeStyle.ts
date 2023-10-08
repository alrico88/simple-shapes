import { json } from "@codemirror/lang-json";
import { EditorView } from "codemirror";

export function useCodeStyle() {
  return {
    extensions: [json(), EditorView.lineWrapping],
    style: {
      backgroundColor: "white",
      height: "100%",
      maxHeight: "300px",
    },
  };
}
