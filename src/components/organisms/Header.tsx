import { Celebration } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import IconSvg from "../../assets/icon.svg";
import { useCelebration } from "../../hooks/useCelebration";
import { VolumeSwitch } from "../atoms/VolumeSwitch";

export function Header(): React.ReactElement {
  const { t } = useTranslation();
  const { handleCelebrate, explosionTrigger, isMuted, setIsMuted } =
    useCelebration();
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
            <VolumeSwitch
              checked={!isMuted}
              onChange={(_, checked) => setIsMuted(!checked)}
              sx={{ gridArea: "volume-switch" }}
            />
            <Tooltip
              title={t("word.お祝いアクションの実行")}
              sx={{ gridArea: "celebration-button" }}
            >
              <IconButton disabled={explosionTrigger} onClick={handleCelebrate}>
                <Celebration />
              </IconButton>
            </Tooltip>
          </Box>
        </nav>
      </header>
    </>
  );
}
