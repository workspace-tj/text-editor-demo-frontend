import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setCompositionKey,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  RangeSelection,
  TextNode,
  createCommand,
} from "lexical";
import { useEffect } from "react";
import {
  StyledTextNode,
  StyledTextNodeParams,
  formatToPixel,
} from "../../nodes/StyledTextNode";
import { updateCssText } from "../../utils/style";

export const FORMAT_STYLED_TEXT_COMMAND: LexicalCommand<StyledTextNodeParams> =
  createCommand("FORMAT_STYLED_TEXT_COMMAND");

export default function StyledTextPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([StyledTextNode])) {
      throw new Error(
        "StyledTextPlugin: StyledTextNode not registered on editor",
      );
    }
    const removeListener = mergeRegister(
      editor.registerCommand(
        FORMAT_STYLED_TEXT_COMMAND,
        (style) => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return false;
          }
          formatTextStyle(selection, style);
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
    return removeListener;
  }, [editor]);

  return null;
}

export const formatTextStyle = (
  selection: RangeSelection,
  style: StyledTextNodeParams,
) => {
  if (selection.isCollapsed()) {
    // When changing format, we should stop composition
    $setCompositionKey(null);
    return;
  }

  const styledKeyArray = Object.keys(style) as (keyof StyledTextNodeParams)[];

  const selectedNodes = selection.getNodes();
  const selectedTextNodes: Array<TextNode> = [];
  for (const selectedNode of selectedNodes) {
    if ($isTextNode(selectedNode)) {
      selectedTextNodes.push(selectedNode);
    }
  }

  const selectedTextNodesLength = selectedTextNodes.length;
  if (selectedTextNodesLength === 0) {
    let updatedStyle = selection.style;
    styledKeyArray.forEach((key) => {
      updatedStyle = updateCssText(
        updatedStyle,
        key,
        formatToPixel(style[key] ?? ""),
        true,
      );
    });
    selection.setStyle(updatedStyle);
    // When changing format, we should stop composition
    $setCompositionKey(null);
    return;
  }

  const anchor = selection.anchor;
  const focus = selection.focus;
  const isBackward = selection.isBackward();
  const startPoint = isBackward ? focus : anchor;
  const endPoint = isBackward ? anchor : focus;

  let firstIndex = 0;
  let firstNode = selectedTextNodes[0];
  let startOffset = startPoint.type === "element" ? 0 : startPoint.offset;

  // In case selection started at the end of text node use next text node
  if (
    startPoint.type === "text" &&
    startOffset === firstNode.getTextContentSize()
  ) {
    firstIndex = 1;
    firstNode = selectedTextNodes[1];
    startOffset = 0;
  }

  if (firstNode == null) {
    return;
  }

  const firstNextFormat = selection.format;

  const lastIndex = selectedTextNodesLength - 1;
  let lastNode = selectedTextNodes[lastIndex];
  const endOffset =
    endPoint.type === "text" ? endPoint.offset : lastNode.getTextContentSize();

  // Single node selected
  if (firstNode.is(lastNode)) {
    // No actual text is selected, so do nothing.
    if (startOffset === endOffset) {
      return;
    }
    // The entire node is selected, so just format it
    if (startOffset === 0 && endOffset === firstNode.getTextContentSize()) {
      const firstNodeFormat = firstNode.getFormat();
      let updatedStyle = firstNode.getStyle();
      styledKeyArray.forEach((key) => {
        updatedStyle = updateCssText(
          updatedStyle,
          key,
          formatToPixel(style[key] ?? ""),
          true,
        );
      });
      firstNode.setFormat(firstNodeFormat);
      firstNode.setStyle(updatedStyle);
    } else {
      // Node is partially selected, so split it into two nodes
      // add style the selected one.
      const splitNodes = firstNode.splitText(startOffset, endOffset);
      const replacement = startOffset === 0 ? splitNodes[0] : splitNodes[1];
      const replacementFormat = replacement.getFormat();
      let updatedStyle = replacement.getStyle();
      styledKeyArray.forEach((key) => {
        updatedStyle = updateCssText(
          updatedStyle,
          key,
          formatToPixel(style[key] ?? ""),
          true,
        );
      });
      replacement.setFormat(replacementFormat);
      replacement.setStyle(updatedStyle);

      // Update selection only if starts/ends on text node
      if (startPoint.type === "text") {
        startPoint.set(replacement.__key, 0, "text");
      }
      if (endPoint.type === "text") {
        endPoint.set(replacement.__key, endOffset - startOffset, "text");
      }
    }

    selection.format = firstNextFormat;

    return;
  }
  // Multiple nodes selected
  // The entire first node isn't selected, so split it
  if (startOffset !== 0) {
    [, firstNode as TextNode] = firstNode.splitText(startOffset);
    startOffset = 0;
  }
  const firstNodeFormat = firstNode.getFormat();
  let updatedFirstNodeStyle = firstNode.getStyle();
  styledKeyArray.forEach((key) => {
    updatedFirstNodeStyle = updateCssText(
      updatedFirstNodeStyle,
      key,
      formatToPixel(style[key] ?? ""),
      true,
    );
  });

  firstNode.setFormat(firstNodeFormat);
  firstNode.setStyle(updatedFirstNodeStyle);

  const lastNextFormat = selection.format;
  // If the offset is 0, it means no actual characters are selected,
  // so we skip formatting the last node altogether.
  if (endOffset > 0) {
    if (endOffset !== lastNode.getTextContentSize()) {
      [lastNode as TextNode] = lastNode.splitText(endOffset);
    }
    const lastNodeFormat = lastNode.getFormat();
    let updatedLastNodeStyle = lastNode.getStyle();
    styledKeyArray.forEach((key) => {
      updatedLastNodeStyle = updateCssText(
        updatedLastNodeStyle,
        key,
        formatToPixel(style[key] ?? ""),
        true,
      );
    });
    lastNode.setFormat(lastNodeFormat);
    lastNode.setStyle(updatedLastNodeStyle);
  }

  // Process all text nodes in between
  for (let i = firstIndex + 1; i < lastIndex; i++) {
    const textNode = selectedTextNodes[i];
    if (!textNode.isToken()) {
      const nextFormat = textNode.getFormat();
      let nextStyle = textNode.getStyle();
      styledKeyArray.forEach((key) => {
        nextStyle = updateCssText(
          nextStyle,
          key,
          formatToPixel(style[key] ?? ""),
          true,
        );
      });
      textNode.setFormat(nextFormat);
      textNode.setStyle(nextStyle);
    }
  }

  // Update selection only if starts/ends on text node
  if (startPoint.type === "text") {
    startPoint.set(firstNode.__key, startOffset, "text");
  }
  if (endPoint.type === "text") {
    endPoint.set(lastNode.__key, endOffset, "text");
  }

  selection.format = firstNextFormat | lastNextFormat;
};
