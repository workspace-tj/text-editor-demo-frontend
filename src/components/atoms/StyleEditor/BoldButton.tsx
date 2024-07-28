import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";

interface BoldButtonProps {
  handleClick: () => void;
  title: string;
  isBold?: boolean;
}

export function BoldButton({ handleClick, title, isBold }: BoldButtonProps) {
  return (
    <Tooltip title={title}>
      <Box
        py={0}
        px={1.5}
        onClick={handleClick}
        sx={{
          backgroundColor: isBold ? "#bbbbbb" : "",
        }}
      >
        <Typography fontSize={20} fontWeight="bold">
          B
        </Typography>
      </Box>
    </Tooltip>
  );
}
