import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";

interface FontColorSelectButtonProps {
  handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  title: string;
  fontColor?: string;
}

export function FontColorSelectButton({
  title,
  handleClick,
  fontColor,
}: FontColorSelectButtonProps) {
  return (
    <Tooltip title={title}>
      <Box px={1.5} position="relative" onClick={handleClick}>
        <Typography
          fontSize={20}
          fontWeight="bold"
          color="primaryWhite.contrastText"
          sx={{
            textDecoration: `underline solid ${fontColor !== "#ffffff" ? fontColor : "skyblue"} 4px`,
          }}
        >
          A
        </Typography>
      </Box>
    </Tooltip>
  );
}
