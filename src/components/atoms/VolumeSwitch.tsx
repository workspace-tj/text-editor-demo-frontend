import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

export const VolumeSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 32 32" ><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M22 16c0-2.36-1.36-4.39-3.33-5.37v2.95l3.27 3.27c.04-.27.06-.55.06-.85zm3.33 0c0 1.25-.27 2.43-.72 3.52l2.01 2.01C27.47 19.88 28 18 28 16c0-5.71-3.99-10.48-9.33-11.69v2.75c3.85 1.15 6.66 4.72 6.66 8.94zM5.69 4L4 5.69 10.31 12H4v8h5.33l6.67 6.67v-8.98l5.67 5.67c-.89.69-1.89 1.24-3 1.57v2.75c1.84-.41 3.51-1.27 4.92-2.41L26.31 28 28 26.31l-12-12L5.69 4zM16 5.33L13.21 8.12 16 10.91V5.33z"/></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
    color: "white",
  },
  "& .Mui-checked": {
    "& + .MuiSwitch-track": {
      backgroundColor: "#2ECA45 !important",
      opacity: 1,
    },
  },
}));
