import {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  TextNode,
} from "lexical";
import { extractStyleFromCssText } from "../utils/style";

export type StyledTextNodeParams = {
  color?: string;
  fontSize?: string | number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  textDecorationColor?: string;
  textDecorationStyle?: string;
  textDecorationLine?: string;
  textDecorationSkipInk?: string;
  textDecorationThickness?: string | number;
  textAlign?: string;
  backgroundColor?: string;
  lineHeight?: string | number;
  verticalAlign?: string | number;
  letterSpacing?: string | number;
  textIndent?: string | number;
};

type SerializedStyledTextNode = SerializedTextNode & StyledTextNodeParams;

export class StyledTextNode extends TextNode {
  __color?: string;
  __fontSize?: string | number;
  __fontFamily?: string;
  __fontWeight?: string | number;
  __fontStyle?: string;
  __textDecorationColor?: string;
  __textDecorationStyle?: string;
  __textDecorationLine?: string;
  __textDecorationSkipInk?: string;
  __textDecorationThickness?: string | number;
  __textAlign?: string;
  __backgroundColor?: string;
  __lineHeight?: string | number;
  __verticalAlign?: string | number;
  __letterSpacing?: string | number;
  __textIndent?: string | number;

  constructor(text: string, key?: NodeKey, style?: StyledTextNodeParams) {
    super(text, key);
    if (style?.color) this.__color = style.color;
    if (style?.fontSize) this.__fontSize = style.fontSize;
    if (style?.fontFamily) this.__fontFamily = style.fontFamily;
    if (style?.fontWeight) this.__fontWeight = style.fontWeight;
    if (style?.fontStyle) this.__fontStyle = style.fontStyle;
    if (style?.textDecorationColor)
      this.__textDecorationColor = style.textDecorationColor;
    if (style?.textDecorationStyle)
      this.__textDecorationStyle = style.textDecorationStyle;
    if (style?.textDecorationLine)
      this.__textDecorationLine = style.textDecorationLine;
    if (style?.textDecorationSkipInk)
      this.__textDecorationSkipInk = style.textDecorationSkipInk;
    if (style?.textDecorationThickness)
      this.__textDecorationThickness = style.textDecorationThickness;
    if (style?.textAlign) this.__textAlign = style.textAlign;
    if (style?.backgroundColor) this.__backgroundColor = style.backgroundColor;
    if (style?.lineHeight) this.__lineHeight = style.lineHeight;
    if (style?.verticalAlign) this.__verticalAlign = style.verticalAlign;
    if (style?.letterSpacing) this.__letterSpacing = style.letterSpacing;
    if (style?.textIndent) this.__textIndent = style.textIndent;
  }

  originalTextNodeToCustom(node: TextNode): StyledTextNode {
    return new StyledTextNode(node.__text, node.__key);
  }

  static getType(): string {
    return "styledTextNode";
  }

  static clone(node: StyledTextNode): StyledTextNode {
    return new StyledTextNode(node.__text, node.__key, node.getStyleParams());
  }

  getStyleParams() {
    const styleParams: StyledTextNodeParams = {};
    if (this.__color) styleParams.color = this.__color;
    if (this.__fontSize) styleParams.fontSize = this.__fontSize;
    if (this.__fontFamily) styleParams.fontFamily = this.__fontFamily;
    if (this.__fontWeight) styleParams.fontWeight = this.__fontWeight;
    if (this.__fontStyle) styleParams.fontStyle = this.__fontStyle;
    if (this.__textDecorationColor)
      styleParams.textDecorationColor = this.__textDecorationColor;
    if (this.__textDecorationStyle)
      styleParams.textDecorationStyle = this.__textDecorationStyle;
    if (this.__textDecorationLine)
      styleParams.textDecorationLine = this.__textDecorationLine;
    if (this.__textDecorationSkipInk)
      styleParams.textDecorationSkipInk = this.__textDecorationSkipInk;
    if (this.__textDecorationThickness)
      styleParams.textDecorationThickness = this.__textDecorationThickness;
    if (this.__textAlign) styleParams.textAlign = this.__textAlign;
    if (this.__backgroundColor)
      styleParams.backgroundColor = this.__backgroundColor;
    if (this.__lineHeight) styleParams.lineHeight = this.__lineHeight;
    if (this.__verticalAlign) styleParams.verticalAlign = this.__verticalAlign;
    if (this.__letterSpacing) styleParams.letterSpacing = this.__letterSpacing;
    if (this.__textIndent) styleParams.textIndent = this.__textIndent;
    return styleParams;
  }

  getColor(): string {
    const self = this.getLatest();
    return self.__color ?? "inherit";
  }
  getFontSize(): string | number {
    const self = this.getLatest();
    return self.__fontSize ?? "inherit";
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    if (this.__color) element.style.color = this.__color;
    if (this.__fontSize)
      element.style.fontSize = formatToPixel(this.__fontSize);
    if (this.__fontFamily) element.style.fontFamily = this.__fontFamily;
    if (this.__fontWeight)
      element.style.fontWeight = formatToPixel(this.__fontWeight);
    if (this.__fontStyle) element.style.fontStyle = this.__fontStyle;
    if (this.__textDecorationColor)
      element.style.textDecorationColor = this.__textDecorationColor;
    if (this.__textDecorationLine)
      element.style.textDecorationLine = this.__textDecorationLine;
    if (this.__textDecorationThickness)
      element.style.textDecorationThickness = formatToPixel(
        this.__textDecorationThickness,
      );
    if (this.__backgroundColor)
      element.style.backgroundColor = this.__backgroundColor;
    if (this.__textAlign) element.style.textAlign = this.__textAlign;
    if (this.__lineHeight)
      element.style.lineHeight = formatToPixel(this.__lineHeight);
    if (this.__verticalAlign)
      element.style.verticalAlign = formatToPixel(this.__verticalAlign);
    if (this.__letterSpacing)
      element.style.letterSpacing = formatToPixel(this.__letterSpacing);
    if (this.__textIndent)
      element.style.textIndent = formatToPixel(this.__textIndent);
    return element;
  }

  updateDOM(
    prevNode: StyledTextNode,
    dom: HTMLElement,
    config: EditorConfig,
  ): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config);
    if (prevNode.__color !== this.__color && this.__color) {
      dom.style.color = this.__color;
    }
    if (prevNode.__fontSize !== this.__fontSize && this.__fontSize) {
      dom.style.fontSize = formatToPixel(this.__fontSize);
    }
    if (prevNode.__fontFamily !== this.__fontFamily && this.__fontFamily) {
      dom.style.fontFamily = this.__fontFamily;
    }
    if (prevNode.__fontWeight !== this.__fontWeight && this.__fontWeight) {
      dom.style.fontWeight = formatToPixel(this.__fontWeight);
    }
    if (prevNode.__fontStyle !== this.__fontStyle && this.__fontStyle) {
      dom.style.fontStyle = this.__fontStyle;
    }
    if (
      prevNode.__textDecorationColor !== this.__textDecorationColor &&
      this.__textDecorationColor
    ) {
      dom.style.textDecorationColor = this.__textDecorationColor;
    }
    if (
      prevNode.__textDecorationLine !== this.__textDecorationLine &&
      this.__textDecorationLine
    ) {
      dom.style.textDecorationLine = this.__textDecorationLine;
    }
    if (
      prevNode.__textDecorationThickness !== this.__textDecorationThickness &&
      this.__textDecorationThickness
    ) {
      dom.style.textDecorationThickness = formatToPixel(
        this.__textDecorationThickness,
      );
    }
    if (prevNode.__textAlign !== this.__textAlign && this.__textAlign) {
      dom.style.textAlign = this.__textAlign;
    }
    if (
      prevNode.__backgroundColor !== this.__backgroundColor &&
      this.__backgroundColor
    ) {
      dom.style.backgroundColor = this.__backgroundColor;
    }
    if (prevNode.__lineHeight !== this.__lineHeight && this.__lineHeight) {
      dom.style.lineHeight = formatToPixel(this.__lineHeight);
    }
    if (
      prevNode.__verticalAlign !== this.__verticalAlign &&
      this.__verticalAlign
    ) {
      dom.style.verticalAlign = formatToPixel(this.__verticalAlign);
    }
    if (
      prevNode.__letterSpacing !== this.__letterSpacing &&
      this.__letterSpacing
    ) {
      dom.style.letterSpacing = formatToPixel(this.__letterSpacing);
    }
    if (prevNode.__textIndent !== this.__textIndent && this.__textIndent) {
      dom.style.textIndent = formatToPixel(this.__textIndent);
    }
    return isUpdated;
  }
  static importJSON(serializedNode: SerializedStyledTextNode): StyledTextNode {
    const serializedNodeStyle = serializedNode.style;
    const node = $createCustomTextNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    const color = extractStyleFromCssText(serializedNodeStyle, "color");
    const fontSize = extractStyleFromCssText(serializedNodeStyle, "font-size");
    const fontFamily = extractStyleFromCssText(
      serializedNodeStyle,
      "font-family",
    );
    const fontWeight = extractStyleFromCssText(
      serializedNodeStyle,
      "font-weight",
    );
    const fontStyle = extractStyleFromCssText(
      serializedNodeStyle,
      "font-style",
    );
    const textDecorationColor = extractStyleFromCssText(
      serializedNodeStyle,
      "text-decoration-color",
    );
    const textDecorationLine = extractStyleFromCssText(
      serializedNodeStyle,
      "text-decoration-line",
    );
    const textDecorationStyle = extractStyleFromCssText(
      serializedNodeStyle,
      "text-decoration-style",
    );
    const textDecorationThickness = extractStyleFromCssText(
      serializedNodeStyle,
      "text-decoration-thickness",
    );
    const textAlign = extractStyleFromCssText(
      serializedNodeStyle,
      "text-align",
    );
    const backgroundColor = extractStyleFromCssText(
      serializedNodeStyle,
      "background-color",
    );
    const lineHeight = extractStyleFromCssText(
      serializedNodeStyle,
      "line-height",
    );
    const verticalAlign = extractStyleFromCssText(
      serializedNodeStyle,
      "vertical-align",
    );
    const letterSpacing = extractStyleFromCssText(
      serializedNodeStyle,
      "letter-spacing",
    );
    const textIndent = extractStyleFromCssText(
      serializedNodeStyle,
      "text-indent",
    );
    if (color) node.setColor(color);
    if (fontSize) node.setFontSize(fontSize);
    if (fontFamily) node.setFontFamily(fontFamily);
    if (fontWeight) node.setFontWeight(fontWeight);
    if (fontStyle) node.setFontStyle(fontStyle);
    if (textDecorationColor) node.setTextDecorationColor(textDecorationColor);
    if (textDecorationLine) node.setTextDecorationLine(textDecorationLine);
    if (textDecorationStyle) node.setTextDecorationStyle(textDecorationStyle);
    if (textDecorationThickness)
      node.setTextDecorationThickness(textDecorationThickness);
    if (textAlign) node.setTextAlign(textAlign);
    if (backgroundColor) node.setBackgroundColor(backgroundColor);
    if (lineHeight) node.setLineHeight(lineHeight);
    if (verticalAlign) node.setVerticalAlign(verticalAlign);
    if (letterSpacing) node.setLetterSpacing(letterSpacing);
    if (textIndent) node.setTextIndent(textIndent);
    return node;
  }

  exportJSON(): SerializedStyledTextNode {
    const exportData: SerializedStyledTextNode = {
      ...super.exportJSON(),
    };

    return exportData;
  }

  setCustomTextStyleParams(textStyleParams: StyledTextNodeParams): this {
    const self = this.getWritable();
    if (textStyleParams.color) self.__color = textStyleParams.color;
    if (textStyleParams.fontSize) self.__fontSize = textStyleParams.fontSize;
    if (textStyleParams.fontFamily)
      self.__fontFamily = textStyleParams.fontFamily;
    if (textStyleParams.fontWeight)
      self.__fontWeight = textStyleParams.fontWeight;
    if (textStyleParams.fontStyle) self.__fontStyle = textStyleParams.fontStyle;
    if (textStyleParams.textDecorationColor)
      self.__textDecorationColor = textStyleParams.textDecorationColor;
    if (textStyleParams.textDecorationLine)
      self.__textDecorationLine = textStyleParams.textDecorationLine;
    if (textStyleParams.textDecorationSkipInk)
      self.__textDecorationSkipInk = textStyleParams.textDecorationSkipInk;
    if (textStyleParams.textDecorationStyle)
      self.__textDecorationStyle = textStyleParams.textDecorationStyle;
    if (textStyleParams.textDecorationThickness)
      self.__textDecorationThickness = textStyleParams.textDecorationThickness;
    if (textStyleParams.textAlign) self.__textAlign = textStyleParams.textAlign;
    if (textStyleParams.backgroundColor)
      self.__backgroundColor = textStyleParams.backgroundColor;
    if (textStyleParams.lineHeight)
      self.__lineHeight = textStyleParams.lineHeight;
    return self;
  }

  setColor(color: string): this {
    const self = this.getWritable();
    self.__color = color;
    return self;
  }
  setFontSize(fontSize: string | number): this {
    const self = this.getWritable();
    self.__fontSize = fontSize;
    return self;
  }
  setFontFamily(fontFamily: string): this {
    const self = this.getWritable();
    self.__fontFamily = fontFamily;
    return self;
  }
  setFontWeight(fontWeight: string | number): this {
    const self = this.getWritable();
    self.__fontWeight = fontWeight;
    return self;
  }
  setFontStyle(fontStyle: string): this {
    const self = this.getWritable();
    self.__fontStyle = fontStyle;
    return self;
  }
  setTextDecorationColor(textDecorationColor: string): this {
    const self = this.getWritable();
    self.__textDecorationColor = textDecorationColor;
    return self;
  }
  setTextDecorationStyle(textDecorationStyle: string): this {
    const self = this.getWritable();
    self.__textDecorationStyle = textDecorationStyle;
    return self;
  }
  setTextDecorationLine(textDecorationLine: string): this {
    const self = this.getWritable();
    self.__textDecorationLine = textDecorationLine;
    return self;
  }
  setTextDecorationThickness(textDecorationThickness: string | number): this {
    const self = this.getWritable();
    self.__textDecorationThickness = textDecorationThickness;
    return self;
  }
  setTextAlign(textAlign: string): this {
    const self = this.getWritable();
    self.__textAlign = textAlign;
    return self;
  }
  setBackgroundColor(backgroundColor: string): this {
    const self = this.getWritable();
    self.__backgroundColor = backgroundColor;
    return self;
  }
  setLineHeight(lineHeight: string | number): this {
    const self = this.getWritable();
    self.__lineHeight = lineHeight;
    return self;
  }
  setVerticalAlign(verticalAlign: string): this {
    const self = this.getWritable();
    self.__verticalAlign = verticalAlign;
    return self;
  }
  setLetterSpacing(letterSpacing: string | number): this {
    const self = this.getWritable();
    self.__letterSpacing = letterSpacing;
    return self;
  }
  setTextIndent(textIndent: string | number): this {
    const self = this.getWritable();
    self.__textIndent = textIndent;
    return self;
  }
}

export function $createCustomTextNode(text: string): StyledTextNode {
  return new StyledTextNode(text);
}

export function $isCustomTextNode(
  node: LexicalNode | null | undefined,
): node is StyledTextNode {
  return node instanceof StyledTextNode;
}

export function formatToPixel(value: string | number): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return `${value}px`;
  return "";
}
