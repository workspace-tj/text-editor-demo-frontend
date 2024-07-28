import {
  TableCellNode,
  SerializedTableCellNode,
  TableCellHeaderStates,
} from "@lexical/table";
import { addClassNamesToElement } from "@lexical/utils";
import {
  LexicalNode,
  LexicalEditor,
  DOMExportOutput,
  EditorConfig,
} from "lexical";

type TableCellHeaderState =
  (typeof TableCellHeaderStates)[keyof typeof TableCellHeaderStates];

interface SerializedCustomTableCellNode extends SerializedTableCellNode {
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
}

export class CustomTableCellNode extends TableCellNode {
  /** @internal */
  __colSpan: number;
  /** @internal */
  __rowSpan: number;
  /** @internal */
  __headerState: TableCellHeaderState;
  /** @internal */
  __width?: number;
  /** @internal */
  __backgroundColor: null | string;
  __borderColor?: string;
  __borderWidth?: number;
  __borderStyle?: string;

  constructor(
    headerState = TableCellHeaderStates.NO_STATUS,
    colSpan = 1,
    width?: number,
  ) {
    super();
    this.__colSpan = colSpan;
    this.__rowSpan = 1;
    this.__headerState = headerState;
    this.__width = width;
    this.__backgroundColor = null;
    this.__borderColor = "black";
    this.__borderWidth = 1;
    this.__borderStyle = "solid";
  }

  static getType(): string {
    return "customtablecell";
  }

  static clone(node: CustomTableCellNode): CustomTableCellNode {
    const cellNode = new CustomTableCellNode(
      node.__headerState,
      node.__colSpan,
      node.__width,
    );
    cellNode.__rowSpan = node.__rowSpan;
    cellNode.__backgroundColor = node.__backgroundColor;
    cellNode.__borderColor = node.__borderColor;
    cellNode.__borderWidth = node.__borderWidth;
    cellNode.__borderStyle = node.__borderStyle;
    return cellNode;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement(
      this.getTag(),
    ) as HTMLTableCellElement;

    if (this.__width) {
      element.style.width = `${this.__width}px`;
    }
    if (this.__colSpan > 1) {
      element.colSpan = this.__colSpan;
    }
    if (this.__rowSpan > 1) {
      element.rowSpan = this.__rowSpan;
    }
    if (this.__backgroundColor !== null) {
      element.style.backgroundColor = this.__backgroundColor;
    }
    if (this.__borderColor) {
      element.style.borderColor = this.__borderColor;
    }
    if (this.__borderWidth !== undefined) {
      element.style.borderWidth = `${this.__borderWidth}px`;
    }
    if (this.__borderStyle) {
      element.style.borderStyle = this.__borderStyle;
    }

    addClassNamesToElement(
      element,
      config.theme.tableCell,
      this.hasHeader() && config.theme.tableCellHeader,
    );

    return element;
  }

  updateDOM(prevNode: CustomTableCellNode): boolean {
    return (
      prevNode.__headerState !== this.__headerState ||
      prevNode.__width !== this.__width ||
      prevNode.__colSpan !== this.__colSpan ||
      prevNode.__rowSpan !== this.__rowSpan ||
      prevNode.__backgroundColor !== this.__backgroundColor ||
      prevNode.__borderColor !== this.__borderColor ||
      prevNode.__borderWidth !== this.__borderWidth ||
      prevNode.__borderStyle !== this.__borderStyle
    );
  }

  static importJSON(
    serializedNode: SerializedCustomTableCellNode,
  ): CustomTableCellNode {
    const colSpan = serializedNode.colSpan || 1;
    const rowSpan = serializedNode.rowSpan || 1;
    const cellNode = $createCustomTableCellNode(
      serializedNode.headerState,
      colSpan,
      serializedNode.width || undefined,
    );
    cellNode.__colSpan = colSpan;
    cellNode.__rowSpan = rowSpan;
    cellNode.__backgroundColor = serializedNode.backgroundColor || null;
    cellNode.__borderColor = serializedNode.borderColor;
    cellNode.__borderWidth = serializedNode.borderWidth;
    cellNode.__borderStyle = serializedNode.borderStyle;
    return cellNode;
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const { element } = super.exportDOM(editor);

    if (element) {
      const element_ = element as HTMLTableCellElement;
      const maxWidth = 700;
      const colCount = this.getParentOrThrow().getChildrenSize();
      const borderColor = this.getBorderColor();
      element_.style.border = `1px solid ${borderColor ?? "black"}`;
      if (this.__colSpan > 1) {
        element_.colSpan = this.__colSpan;
      }
      if (this.__rowSpan > 1) {
        element_.rowSpan = this.__rowSpan;
      }
      element_.style.width = `${this.getWidth() || Math.max(90, maxWidth / colCount)}px`;

      element_.style.verticalAlign = "top";
      element_.style.textAlign = "start";

      const backgroundColor = this.getBackgroundColor();
      if (backgroundColor !== null) {
        element_.style.backgroundColor = backgroundColor;
      } else if (this.hasHeader()) {
        element_.style.backgroundColor = "#f2f3f5";
      }
    }

    return {
      element,
    };
  }

  exportJSON(): SerializedCustomTableCellNode {
    return {
      ...super.exportJSON(),
      backgroundColor: this.getBackgroundColor(),
      borderColor: this.getBorderColor(),
      borderWidth: this.getBorderWidth(),
      borderStyle: this.getBorderStyle(),
      colSpan: this.__colSpan,
      headerState: this.__headerState,
      rowSpan: this.__rowSpan,
      type: "customtablecell",
      width: this.getWidth(),
    };
  }

  getBorderColor(): undefined | string {
    return this.getLatest().__borderColor;
  }

  setBorderColor(borderColor: undefined | string): void {
    this.getWritable().__borderColor = borderColor;
  }
  getBorderWidth(): undefined | number {
    return this.getLatest().__borderWidth;
  }

  setBorderWidth(borderWidth: undefined | number): void {
    this.getWritable().__borderWidth = borderWidth;
  }
  getBorderStyle(): undefined | string {
    return this.getLatest().__borderStyle;
  }

  setBorderStyle(borderStyle: undefined | string): void {
    this.getWritable().__borderStyle = borderStyle;
  }
}

export function $createCustomTableCellNode(
  headerState: TableCellHeaderState,
  colSpan = 1,
  width?: number,
): CustomTableCellNode {
  return new CustomTableCellNode(headerState, colSpan, width);
}

export function $isCustomTableCellNode(
  node: LexicalNode | null | undefined,
): node is CustomTableCellNode {
  return node instanceof CustomTableCellNode;
}
