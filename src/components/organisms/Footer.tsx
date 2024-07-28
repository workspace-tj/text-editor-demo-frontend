import { Box, Typography } from "@mui/material";
import React from "react";

const version = import.meta.env.VITE_APP_VERSION_HASH;

export function Footer(): React.ReactElement {
  return (
    <>
      <footer className="footer">
        <Box className="footer-container">
          <Typography gridArea="version">v.{version}</Typography>
        </Box>
      </footer>
    </>
  );
}
