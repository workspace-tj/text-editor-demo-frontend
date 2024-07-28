import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import { Box, Menu, type SelectChangeEvent } from "@mui/material";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FORMAT_STYLED_TEXT_COMMAND } from "../StyledTextPlugin";
import { BackGroundColorSelectButton } from "~/components/atoms/StyleEditor/BackGroundColorSelectButton";
import { BoldButton } from "~/components/atoms/StyleEditor/BoldButton";
import { FontColorSelectButton } from "~/components/atoms/StyleEditor/FontColorSelectButton";
import { FontFamilySelector } from "~/components/atoms/StyleEditor/FontFamilySelector";
import { FontSizeInput } from "~/components/atoms/StyleEditor/FontSizeInput";
import { ItalicButton } from "~/components/atoms/StyleEditor/ItalicButton";
import { UnderLineButton } from "~/components/atoms/StyleEditor/UnderLineButton";
import { VerticalAlignSelector } from "~/components/atoms/StyleEditor/VerticalAlignSelector";
// import { ColorSelectMenu } from "~/components/molecules/ColorSelectMenu";
import { $getSelectionStyleValueForProperty } from "~/lexical/utils/style";

// 実測して出してます。今後追加があれば再実測してください。
const TOOLBAR_SINGLE_ROW_WIDTH = 470;

export default function ToolbarPlugin(): React.ReactElement | null {
  const { t } = useTranslation();
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [colorAnchorEl, setColorAnchorEl] = useState<HTMLElement | null>(null);
  const [bgcolorAnchorEl, setBgcolorAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [fontColor, setFontColor] = useState<string>("#000");
  const [fontFamily, setFontFamily] = useState<string>("sans-serif");
  const [fontSize, setFontSize] = useState<number | string>("medium");
  const [bgcolor, setBgColor] = useState<string>("#fff");
  const [verticalAlign, setVerticalAlign] = useState<string>("baseline");
  const [toolbarPosition, setToolbarPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // FIXME: ほかのエディター選択時に閉じる
  const $updateToolbarPosition = useCallback(() => {
    const selection = $getSelection();
    const nativeSelection = window.getSelection();
    const { scrollX, scrollY } = window;

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rect = nativeSelection.getRangeAt(0).getBoundingClientRect();
      const wrapCount = Math.floor(
        TOOLBAR_SINGLE_ROW_WIDTH / (window.innerWidth - rect.left),
      );
      setToolbarPosition({
        top: rect.top - 80 - 50 * wrapCount + scrollY,
        left: rect.left - 20 + scrollX,
      });
    } else {
      setToolbarPosition(null);
    }
  }, [editor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateToolbarPosition();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbarPosition();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbarPosition();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, $updateToolbarPosition]);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setFontColor(
        $getSelectionStyleValueForProperty(selection, "color", "#000"),
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#fff",
        ),
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(
          selection,
          "font-family",
          "sans-serif",
        ),
      );
      setVerticalAlign(
        $getSelectionStyleValueForProperty(
          selection,
          "vertical-align",
          "baseline",
        ),
      );
      setFontSize(
        $getSelectionStyleValueForProperty(selection, "font-size", "medium"),
      );
    }
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        $updateToolbarPosition();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );
  }, [editor, $updateToolbar, $updateToolbarPosition]);
  const handleClickColorButton = (e: React.MouseEvent<HTMLElement>) => {
    setColorAnchorEl(e.currentTarget);
  };
  const handleClickBgcolorButton = (e: React.MouseEvent<HTMLElement>) => {
    setBgcolorAnchorEl(e.currentTarget);
  };
  const handleCloseColorMenu = () => {
    setColorAnchorEl(null);
  };
  const handleCloseBgcolorMenu = () => {
    setBgcolorAnchorEl(null);
  };
  const handleChangeFontFamily = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    const value = e.target.value;
    activeEditor.dispatchCommand(FORMAT_STYLED_TEXT_COMMAND, {
      fontFamily: value,
    });
  };
  const handleChangeFontSize = (e: React.FocusEvent<HTMLInputElement>) => {
    activeEditor.dispatchCommand(FORMAT_STYLED_TEXT_COMMAND, {
      fontSize: parseInt(e.target.value, 10),
    });
  };

  const handleBoldClicked = () => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const handleItalicClicked = () => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const handleUnderlineClicked = () => {
    activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  };

  // const handleChangeColor = (color: string) => {
  //   activeEditor.dispatchCommand(FORMAT_STYLED_TEXT_COMMAND, {
  //     color: color,
  //   });
  // };
  // const handleChangeBgcolor = (color: string) => {
  //   activeEditor.dispatchCommand(FORMAT_STYLED_TEXT_COMMAND, {
  //     backgroundColor: color,
  //   });
  // };
  const handleChangeVerticalAlign = (e: SelectChangeEvent<string>) => {
    e.preventDefault();
    const value = e.target.value;
    activeEditor.dispatchCommand(FORMAT_STYLED_TEXT_COMMAND, {
      verticalAlign: value,
    });
  };

  return toolbarPosition ? (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        padding: 1,
        gap: 1,
        color: "primaryWhite.contrastText",
        backgroundColor: "primaryWhite.main",
        verticalAlign: "middle",
        position: "absolute",
        top: toolbarPosition.top,
        left: toolbarPosition.left,
        zIndex: "1000",
        boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)",
        borderRadius: "8px",
        transition: "opacity 0.5s",
        willChange: "transform",
      }}
      ref={containerRef}
    >
      <FontFamilySelector
        handleChange={handleChangeFontFamily}
        fontFamily={fontFamily}
      />
      <FontSizeInput onBlur={handleChangeFontSize} defaultValue={fontSize} />
      <BoldButton
        title={`${t("word.太字")} ${t("shortcut.太文字")}`}
        handleClick={handleBoldClicked}
        isBold={isBold}
      />
      <ItalicButton
        title={`${t("word.斜体")} ${t("shortcut.斜体")}`}
        handleClick={handleItalicClicked}
        isItalic={isItalic}
      />
      <UnderLineButton
        title={`${t("word.下線")} ${t("shortcut.下線")}`}
        handleClick={handleUnderlineClicked}
        isUnderline={isUnderline}
      />
      <FontColorSelectButton
        title={t("word.フォントの色")}
        handleClick={handleClickColorButton}
        fontColor={fontColor}
      />
      <Menu
        open={!!colorAnchorEl}
        anchorEl={colorAnchorEl}
        onClose={handleCloseColorMenu}
      >
        {/* <ColorSelectMenu
          anchorEl={colorAnchorEl}
          handleClickEachColor={handleChangeColor}
        /> */}
      </Menu>
      <BackGroundColorSelectButton
        title={t("word.背景色")}
        handleClick={handleClickBgcolorButton}
        backgroundColor={bgcolor}
      />
      <Menu
        open={!!bgcolorAnchorEl}
        anchorEl={bgcolorAnchorEl}
        onClose={handleCloseBgcolorMenu}
      >
        {/* <ColorSelectMenu
          anchorEl={bgcolorAnchorEl}
          handleClickEachColor={handleChangeBgcolor}
        /> */}
      </Menu>
      <VerticalAlignSelector
        handleChange={handleChangeVerticalAlign}
        verticalAlign={verticalAlign}
      />
    </Box>
  ) : null;
}
