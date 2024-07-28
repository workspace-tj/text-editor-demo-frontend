import { Box } from "@mui/material";
import React from "react";
import { Footer } from "../organisms/Footer";
import { Header } from "../organisms/Header";

export function DefaultTemplate({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <Box className="layout">
      <Header />
      <Box className="main">{children}</Box>
      <Footer />
    </Box>
  );
}
