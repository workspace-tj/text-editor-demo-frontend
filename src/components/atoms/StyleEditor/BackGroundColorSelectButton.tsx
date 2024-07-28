import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";

interface BackGroundColorSelectButtonProps {
  title: string;
  handleClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  backgroundColor?: string;
}

export function BackGroundColorSelectButton({
  title,
  handleClick,
  backgroundColor,
}: BackGroundColorSelectButtonProps) {
  return (
    <Tooltip title={title}>
      <Box
        px={1.5}
        position="relative"
        sx={{
          backgroundColor: backgroundColor,
        }}
        onClick={handleClick}
      >
        <Typography fontSize={20} fontWeight="bold" color="primaryWhite.contrastText">
          A
        </Typography>
      </Box>
    </Tooltip>
  );
}
