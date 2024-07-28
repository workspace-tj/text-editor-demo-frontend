import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";

interface ItalicButtonProps {
  title: string;
  handleClick: () => void;
  isItalic?: boolean;
}

export function ItalicButton({ title, handleClick, isItalic }: ItalicButtonProps) {
  return (
    <Tooltip title={title}>
      <Box
        py={0}
        px={1.5}
        onClick={handleClick}
        sx={{
          backgroundColor: isItalic ? "#bbbbbb" : "",
        }}
      >
        <Typography fontSize={20} fontStyle="italic">
          I
        </Typography>
      </Box>
    </Tooltip>
  );
}
