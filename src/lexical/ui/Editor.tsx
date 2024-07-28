import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { TableCellNode } from "@lexical/table";
import { EditorState, createEditor } from "lexical";
import React, { useEffect, useMemo } from "react";
import { CustomTableCellNode } from "~/lexical/nodes/CustomTableNode";
import { Nodes } from "~/lexical/nodes/Nodes";
import ComponentPickerMenuPlugin from "~/lexical/plugins/ComponentPickerPlugin";
import EquationsPlugin from "~/lexical/plugins/EquationsPlugin";
import MarkdownPlugin from "~/lexical/plugins/MarkdownShortcutPlugin";
import StyledTextPlugin from "~/lexical/plugins/StyledTextPlugin";
import TableCellResizerPlugin from "~/lexical/plugins/TableCellResizer";
import CustomTablePlugin from "~/lexical/plugins/TablePlugin";
import ToolbarPlugin from "~/lexical/plugins/ToolbarPlugin";
import theme from "~/lexical/theme/PlaygroundEditorTheme";

export interface EditorProps {
  initialEditorState?: any;
  plugins?: React.ReactNode[];
  isEditable?: boolean;
  style?: React.CSSProperties;
  transformStyle?: React.CSSProperties;
  onChange?: (editorState: EditorState) => void;
  isFocus?: boolean;
  setIsFocus?: React.Dispatch<React.SetStateAction<boolean>>;
}

function MyOnChangePlugin({ onChange }: { onChange: any }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

const AutoFocusPlugin = ({
  defaultSelection,
  isFocus = false,
  setIsFocus,
}: {
  defaultSelection?: "rootStart" | "rootEnd";
  isFocus?: boolean;
  setIsFocus?: React.Dispatch<React.SetStateAction<boolean>>;
}): null => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!isFocus) return;
    editor.focus(
      () => {
        const activeElement = document.activeElement;
        const rootElement = editor.getRootElement() as HTMLDivElement;
        if (
          rootElement !== null &&
          (activeElement === null || !rootElement.contains(activeElement))
        ) {
          // Note: preventScroll won't work in Webkit.
          rootElement.focus({ preventScroll: true });
        }
      },
      { defaultSelection },
    );
    return () => {
      setIsFocus && setIsFocus(false);
    };
    // eslint-disable-next-line
  }, [defaultSelection, isFocus]);

  return null;
};

// FIXME: エラー処理を設定
function onError() {
  // console.error(error);
}

const initialConfig = {
  namespace: "MyEditor",
  editable: false,
  nodes: [
    ...Nodes,
    {
      replace: TableCellNode,
      with: (node: TableCellNode) =>
        new CustomTableCellNode(
          node.__headerState,
          node.__colSpan,
          node.__width,
        ),
    },
  ],
  theme,
  onError,
};

export function Editor({
  initialEditorState,
  isEditable = false,
  style,
  transformStyle,
  onChange,
  plugins,
  isFocus,
  setIsFocus,
}: EditorProps) {
  // parse可能なeditorStateが渡されているかを判定
  const checkedInitialConfig: InitialConfigType = useMemo(() => {
    const newEditor = createEditor(initialConfig);
    try {
      const parsedEditorState = newEditor.parseEditorState(
        JSON.stringify(initialEditorState, null, 2),
      );
      newEditor.setEditorState(parsedEditorState);
      return {
        ...initialConfig,
        editable: isEditable,
        editorState: JSON.stringify(initialEditorState, null, 2),
      };
    } catch (e) {
      return {
        ...initialConfig,
        editable: isEditable,
        editorState: null,
      };
    }
  }, [initialEditorState, isEditable]);

  return (
    <LexicalComposer initialConfig={checkedInitialConfig}>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <div className="editor-scroller">
            <div className="editor" style={transformStyle}>
              <ContentEditable style={style} />
            </div>
          </div>
        }
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ComponentPickerMenuPlugin />
      <ClearEditorPlugin />
      <HorizontalRulePlugin />
      <StyledTextPlugin />
      <HistoryPlugin />
      <ListPlugin />
      <AutoFocusPlugin isFocus={isFocus} setIsFocus={setIsFocus} />
      <TablePlugin />
      <CustomTablePlugin />
      <EquationsPlugin />
      <MarkdownPlugin />
      <TabIndentationPlugin />
      <TableCellResizerPlugin magnification={0.5} />
      <MyOnChangePlugin onChange={onChange} />
      {plugins &&
        plugins.map((Plugin, index) => <div key={index}>{Plugin}</div>)}
    </LexicalComposer>
  );
}
