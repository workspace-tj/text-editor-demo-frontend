import {
  $isRangeSelection,
  $isTextNode,
  RangeSelection,
  TextNode,
} from "lexical";

export const extractStyleFromCssText = (
  cssText: string,
  cssProperty: string,
) => {
  // 正規表現を使用して CSS テキストから該当する property を抽出する
  const regex = new RegExp(`${cssProperty}:\\s*([^;]+)`);
  const match = cssText.match(regex);
  // マッチした property の値を返す
  return match ? match[1] : null;
};

export const updateCssText = (
  cssText: string,
  cssProperty: string,
  updateValue: string,
  isCamel: boolean = false,
): string => {
  const formattedCssProperty = isCamel
    ? camelToKebab(cssProperty)
    : cssProperty;
  const cssTextArray = cssText.split(";");
  let hasCssProperty = false;
  const updatedCssTextArray = cssTextArray.map((text) => {
    if (!text.trim().startsWith(formattedCssProperty)) return text;
    // 正規表現を使用して指定されたプロパティを含む部分を置換する
    const regex = new RegExp(`(${formattedCssProperty}:\\s*)([^;]+)`);
    const updatedCssText = text.replace(regex, `$1${updateValue}`);
    hasCssProperty = true;
    return updatedCssText;
  });
  // 指定されたプロパティが存在しない場合は追加する
  if (!hasCssProperty) {
    updatedCssTextArray.push(`${formattedCssProperty}: ${updateValue}`);
  }

  return updatedCssTextArray.join(";");
};

/**
 * Creates an object containing all the styles and their values provided in the CSS string.
 * @param css - The CSS string of styles and their values.
 * @returns The styleObject containing all the styles and their values.
 */
export function getStyleObjectFromRawCSS(css: string): Record<string, string> {
  const styleObject: Record<string, string> = {};
  const styles = css.split(";");

  for (const style of styles) {
    if (style !== "") {
      const [key, value] = style.split(/:([^]+)/); // split on first colon
      if (key && value) {
        styleObject[key.trim()] = value.trim();
      }
    }
  }

  return styleObject;
}

const CSS_TO_STYLES: Map<string, Record<string, string>> = new Map();

/**
 * Given a CSS string, returns an object from the style cache.
 * @param css - The CSS property as a string.
 * @returns The value of the given CSS property.
 */
export function getStyleObjectFromCSS(css: string): Record<string, string> {
  let value = CSS_TO_STYLES.get(css);
  if (value === undefined) {
    value = getStyleObjectFromRawCSS(css);
    CSS_TO_STYLES.set(css, value);
  }

  return value;
}

/**
 * Returns the current value of a CSS property for TextNodes in the Selection, if set. If not set, it returns the defaultValue.
 * If all TextNodes do not have the same value, it returns an empty string.
 * @param selection - The selection of TextNodes whose value to find.
 * @param styleProperty - The CSS style property.
 * @param defaultValue - The default value for the property, defaults to an empty string.
 * @returns The value of the property for the selected TextNodes.
 */
export function $getSelectionStyleValueForProperty(
  selection: RangeSelection, // | TableSelection,
  styleProperty: string,
  defaultValue = "",
): string {
  let styleValue: string | null = null;
  const nodes = selection.getNodes();
  const anchor = selection.anchor;
  const focus = selection.focus;
  const isBackward = selection.isBackward();
  const endOffset = isBackward ? focus.offset : anchor.offset;
  const endNode = isBackward ? focus.getNode() : anchor.getNode();

  if (
    $isRangeSelection(selection) &&
    selection.isCollapsed() &&
    selection.style !== ""
  ) {
    const css = selection.style;
    const styleObject = getStyleObjectFromCSS(css);

    if (styleObject !== null && styleProperty in styleObject) {
      return styleObject[styleProperty];
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    // if no actual characters in the end node are selected, we don't
    // include it in the selection for purposes of determining style
    // value
    if (i !== 0 && endOffset === 0 && node.is(endNode)) {
      continue;
    }

    if ($isTextNode(node)) {
      const nodeStyleValue = $getNodeStyleValueForProperty(
        node,
        styleProperty,
        defaultValue,
      );

      if (styleValue === null) {
        styleValue = nodeStyleValue;
      } else if (styleValue !== nodeStyleValue) {
        // multiple text nodes are in the selection and they don't all
        // have the same style.
        styleValue = "";
        break;
      }
    }
  }

  return styleValue === null ? defaultValue : styleValue;
}

/**
 * Returns the current value of a CSS property for Nodes, if set. If not set, it returns the defaultValue.
 * @param node - The node whose style value to get.
 * @param styleProperty - The CSS style property.
 * @param defaultValue - The default value for the property.
 * @returns The value of the property for node.
 */
function $getNodeStyleValueForProperty(
  node: TextNode,
  styleProperty: string,
  defaultValue: string,
): string {
  const css = node.getStyle();
  const styleObject = getStyleObjectFromCSS(css);

  if (styleObject !== null) {
    return styleObject[styleProperty] || defaultValue;
  }

  return defaultValue;
}

export function camelToKebab(camelCase: string) {
  return camelCase.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
