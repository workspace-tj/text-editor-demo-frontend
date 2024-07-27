import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

interface CelebrationDialogProps {
  open: boolean;
  handleClose: () => void;
}

export function CelebrationDialog({
  open,
  handleClose,
}: CelebrationDialogProps): React.ReactElement {
  const { t } = useTranslation();
  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t("celebration.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("celebration.description")}</DialogContentText>
        </DialogContent>
        <DialogActions onClick={handleClose}>{t("common.close")}</DialogActions>
      </Dialog>
    </>
  );
}
