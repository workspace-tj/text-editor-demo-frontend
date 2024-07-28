import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import IconSvg from "../../assets/icon.svg";

export function Header(): React.ReactElement {
  const { t } = useTranslation();
  return (
    <>
      <header className="header">
        <nav style={{ height: "100%" }}>
          <Box
            display="flex"
            py={1}
            px={3}
            alignItems="center"
            gap={2}
            bgcolor="neutral.main"
          >
            <img src={IconSvg} height={32} />
            <Typography variant="h3" fontSize={32}>
              Text&nbsp;Editor&nbsp;Demo
            </Typography>
          </Box>
        </nav>
      </header>
    </>
  );
}
