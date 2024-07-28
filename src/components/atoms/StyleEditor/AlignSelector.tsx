import { IconButton, Tooltip } from "@mui/material";
import React from "react";

interface AlignSelectorProps {
  title: string;
  handleClick: () => void;
  icon: React.ElementType;
  align: string;
  currentValue: string;
}

export function AlignSelector({
  title,
  handleClick,
  align,
  currentValue,
  icon: Icon,
}: AlignSelectorProps) {
  return (
    <Tooltip title={title}>
      <IconButton onClick={handleClick}>
        <Icon
          sx={{
            backgroundColor: currentValue === align ? "#bbbbbb" : "",
          }}
        />
      </IconButton>
    </Tooltip>
  );
}
