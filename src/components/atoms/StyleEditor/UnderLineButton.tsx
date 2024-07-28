import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";

interface UnderLineButtonProps {
  title: string;
  handleClick: () => void;
  isUnderline?: boolean;
}

export function UnderLineButton({ title, handleClick, isUnderline }: UnderLineButtonProps) {
  return (
    <Tooltip title={title}>
      <Box
        py={0}
        px={1.5}
        onClick={handleClick}
        sx={{
          backgroundColor: isUnderline ? "#bbbbbb" : "",
        }}
      >
        <Typography fontSize={20} sx={{ textDecoration: "underline" }}>
          U
        </Typography>
      </Box>
    </Tooltip>
  );
}
