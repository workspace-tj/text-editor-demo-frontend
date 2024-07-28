import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_TABLE_COMMAND,
  $createTableNodeWithDimensions,
  InsertTableCommandPayload,
  $isTableSelection,
  $isTableNode,
  $isTableRowNode,
  TableNode,
  TableRowNode,
  //   $getNodeTriplet,
} from "@lexical/table";
import {
  $insertNodeToNearestRoot,
  mergeRegister,
  $findMatchingParent,
} from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_EDITOR,
  LexicalCommand,
  LexicalNode,
  PointType,
  createCommand,
} from "lexical";
import { useEffect } from "react";
import {
  $isCustomTableCellNode,
  CustomTableCellNode,
} from "../../nodes/CustomTableNode";

export const FORMAT_TABLE_CELL_BORDER_COLOR_COMMAND: LexicalCommand<string> =
  createCommand("FORMAT_TABLE_CELL_BORDER_COLOR");

export const FORMAT_TABLE_CELL_BORDER_WIDTH_COMMAND: LexicalCommand<number> =
  createCommand("FORMAT_TABLE_CELL_BORDER_WIDTH_COMMAND");

export const FORMAT_TABLE_CELL_BORDER_STYLE_COMMAND: LexicalCommand<string> =
  createCommand("FORMAT_TABLE_CELL_BORDER_STYLE_COMMAND");

export default function CustomTablePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([CustomTableCellNode])) {
      throw new Error(
        "TablePlugin: CustomTableCellNode is not registered on editor",
      );
    }
    const removeListener = mergeRegister(
      editor.registerCommand(
        FORMAT_TABLE_CELL_BORDER_COLOR_COMMAND,
        (color) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection) || $isTableSelection(selection)) {
            const [cell] = $getNodeTriplet(selection.anchor);
            if ($isCustomTableCellNode(cell)) {
              cell.setBorderColor(color);
              return true;
            }

            if ($isTableSelection(selection)) {
              const nodes = selection.getNodes();

              for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if ($isCustomTableCellNode(node)) {
                  node.setBorderColor(color);
                }
              }
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        FORMAT_TABLE_CELL_BORDER_WIDTH_COMMAND,
        (borderWidth) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection) || $isTableSelection(selection)) {
            const [cell] = $getNodeTriplet(selection.anchor);
            if ($isCustomTableCellNode(cell)) {
              cell.setBorderWidth(borderWidth);
              return true;
            }

            if ($isTableSelection(selection)) {
              const nodes = selection.getNodes();

              for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if ($isCustomTableCellNode(node)) {
                  node.setBorderWidth(borderWidth);
                }
              }
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        FORMAT_TABLE_CELL_BORDER_STYLE_COMMAND,
        (borderStyle) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection) || $isTableSelection(selection)) {
            const [cell] = $getNodeTriplet(selection.anchor);
            if ($isCustomTableCellNode(cell)) {
              cell.setBorderStyle(borderStyle);
              return true;
            }

            if ($isTableSelection(selection)) {
              const nodes = selection.getNodes();

              for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                if ($isCustomTableCellNode(node)) {
                  node.setBorderStyle(borderStyle);
                }
              }
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<InsertTableCommandPayload>(
        INSERT_TABLE_COMMAND,
        ({ columns, rows, includeHeaders }) => {
          const tableNode = $createTableNodeWithDimensions(
            Number(rows),
            Number(columns),
            includeHeaders,
          );
          $insertNodeToNearestRoot(tableNode);

          const firstDescendant = tableNode.getFirstDescendant();
          if ($isTextNode(firstDescendant)) {
            firstDescendant.select();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
    return removeListener;
  }, [editor]);

  return null;
}

function $getNodeTriplet(
  source: PointType | LexicalNode | CustomTableCellNode,
): [CustomTableCellNode, TableRowNode, TableNode] {
  let cell: CustomTableCellNode;
  if (source instanceof CustomTableCellNode) {
    cell = source;
  } else if ("__type" in source) {
    const cell_ = $findMatchingParent(source, $isCustomTableCellNode);
    invariant(
      $isCustomTableCellNode(cell_),
      "Expected to find a parent TableCellNode",
    );
    cell = cell_;
  } else {
    const cell_ = $findMatchingParent(source.getNode(), $isCustomTableCellNode);
    invariant(
      $isCustomTableCellNode(cell_),
      "Expected to find a parent TableCellNode",
    );
    cell = cell_;
  }
  const row = cell.getParent();
  invariant(
    $isTableRowNode(row),
    "Expected TableCellNode to have a parent TableRowNode",
  );
  const grid = row.getParent();
  invariant(
    $isTableNode(grid),
    "Expected TableRowNode to have a parent GridNode",
  );
  return [cell, row, grid];
}
function invariant(
  cond?: boolean,
  message?: string,
  // ...args: string[]
): asserts cond {
  if (cond) {
    return;
  }

  throw new Error(
    "Internal Lexical error: invariant() is meant to be replaced at compile " +
      "time. There is no runtime version. Error: " +
      message,
  );
}
