import { Box, Tooltip, Typography } from "@mui/material";
import React from "react";

interface FontSizeEditButtonProps {
  fontSize: number;
  title: string;
  handleClick: () => void;
}

export function FontSizeEditButton({
  title,
  fontSize,
  handleClick,
}: FontSizeEditButtonProps): React.ReactElement {
  return (
    <Tooltip title={title}>
      <Box py={0} px={1.5} onClick={handleClick}>
        <Typography fontSize={fontSize}>A</Typography>
      </Box>
    </Tooltip>
  );
}
