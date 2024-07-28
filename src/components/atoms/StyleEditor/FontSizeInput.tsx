import { Input, type InputProps, Tooltip } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export function FontSizeInput({ ...props }: InputProps) {
  const { t } = useTranslation();
  return (
    <Tooltip title={t("word.フォントサイズ")}>
      <Input type="number" sx={{ width: 70, height: 35, pl: 1, ...props.sx }} {...props} />
    </Tooltip>
  );
}
