import {
  MenuItem,
  Select,
  type SelectChangeEvent,
  Tooltip,
  type SelectProps,
} from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ratioList = [-50, -25, -10, -5, 0, 5, 10, 25, 50];

const verticalAlignList = [
  { label: "Top", value: "top" },
  { label: "Middle", value: "middle" },
  { label: "Bottom", value: "bottom" },
  { label: "Baseline", value: "baseline" },
  { label: "Sub", value: "sub" },
  { label: "Super", value: "super" },
  { label: "Text Top", value: "text-top" },
  { label: "Text Bottom", value: "text-bottom" },
];

interface VerticalAlignSelectorProps {
  verticalAlign?: string | number;
  handleChange: (e: SelectChangeEvent<string>) => void;
}

export function VerticalAlignSelector({
  verticalAlign,
  handleChange,
  ...props
}: VerticalAlignSelectorProps & SelectProps<string>) {
  const { t } = useTranslation();
  const [selectValue, setSelectValue] = React.useState("");

  const formatToSelectOption = (verticalAlign?: string | number): string => {
    if (!verticalAlign) return "";
    if (verticalAlignList.some((val) => val.value === verticalAlign)) {
      return verticalAlign.toString();
    } else if (ratioList.some((ratio) => `${ratio}%` === verticalAlign)) {
      return verticalAlign.toString();
    } else return "";
  };

  useEffect(() => {
    setSelectValue(formatToSelectOption(verticalAlign));
  }, [verticalAlign]);

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
        {verticalAlignList.map((verticalAlign, index) => {
          return (
            <MenuItem
              key={index}
              value={`${verticalAlign.value}`}
              sx={{ verticalAlign: verticalAlign.value }}
            >
              {verticalAlign.label}
            </MenuItem>
          );
        })}
        {ratioList.map((ratio) => (
          <MenuItem key={ratio} value={`${ratio}%`}>
            {ratio}%
          </MenuItem>
        ))}
      </Select>
    </Tooltip>
  );
}
