import { Close } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";

interface CloseButtonProps {
  title: string;
  handleClick: () => void;
}

export function CloseButton({ title, handleClick }: CloseButtonProps) {
  return (
    <Tooltip title={title}>
      <IconButton onClick={handleClick}>
        <Close />
      </IconButton>
    </Tooltip>
  );
}
