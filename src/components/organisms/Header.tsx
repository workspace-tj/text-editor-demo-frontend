import { Celebration } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import IconSvg from "../../assets/icon.svg";

export function Header(): React.ReactElement {
  const { t } = useTranslation();
  return (
    <>
      <header className="header">
        <nav style={{ height: "100%" }}>
          <Box className="header-container" bgcolor="neutral.main">
            <img src={IconSvg} height={32} style={{ gridArea: "icon" }} />
            <Typography
              variant="h3"
              fontSize={32}
              color="neutral.contrastText"
              gridArea="title"
            >
              Text&nbsp;Editor&nbsp;Demo
            </Typography>
            <Tooltip
              title={t("word.お祝いアクションの実行")}
              sx={{ gridArea: "celebration" }}
            >
              <IconButton>
                <Celebration />
              </IconButton>
            </Tooltip>
          </Box>
        </nav>
      </header>
    </>
  );
}
