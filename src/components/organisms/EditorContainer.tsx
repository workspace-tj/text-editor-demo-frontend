import React from "react";
import { Editor } from "../../lexical/ui/Editor";

export function EditorContainer(): React.ReactElement {
  return (
    <>
      <Editor isEditable style={{ width: "100%", minHeight: 25 }} />
    </>
  );
}
