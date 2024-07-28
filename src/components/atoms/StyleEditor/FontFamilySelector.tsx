import { MenuItem, Select, type SelectChangeEvent, Tooltip, type SelectProps } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fontFamilyList } from "~/constants/fontFamily";

interface FontFamilySelectorProps {
  fontFamily?: string;
  handleChange: (e: SelectChangeEvent<string>) => void;
}

export function FontFamilySelector({
  fontFamily,
  handleChange,
  ...props
}: FontFamilySelectorProps & SelectProps<string>) {
  const { t } = useTranslation();
  const [selectValue, setSelectValue] = React.useState("");

  useEffect(() => {
    setSelectValue(fontFamily ?? "");
  }, [fontFamily]);

  const onChange = (e: SelectChangeEvent<string>) => {
    handleChange(e);
    setSelectValue(e.target.value);
  };
  return (
    <Tooltip title={t("word.フォント")}>
      <Select
        defaultValue=""
        value={selectValue}
        onChange={onChange}
        sx={{ height: 35, minWidth: 100, borderRadius: 0 }}
        {...props}
      >
        {fontFamilyList.map((fontFamily, index) => {
          return fontFamily.familyName ? (
            <MenuItem
              key={index}
              value={`"${fontFamily.familyName}", ${fontFamily.genericName}`}
              sx={{ fontFamily: fontFamily.familyName }}
            >
              {fontFamily.label}
            </MenuItem>
          ) : (
            <MenuItem
              key={index}
              value={fontFamily.genericName}
              sx={{ fontFamily: fontFamily.genericName }}
            >
              {fontFamily.label}
            </MenuItem>
          );
        })}
      </Select>
    </Tooltip>
  );
}
