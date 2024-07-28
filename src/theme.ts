import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#3c493f",
      contrastText: "#fbf9fe",
    },
    secondary: {
      main: "#a2e3c4",
      contrastText: "#222222",
    },
    primaryLight: {
      main: "#7e8d85",
      contrastText: "#222222",
    },
    primaryWhite: {
      main: "#fbf9fe",
      contrastText: "#222222",
    },
    primaryGray: {
      main: "#b3bfb8",
      contrastText: "#fbf9fe",
    },
    neutral: {
      main: "#F8F8F8",
      contrastText: "#020202",
    },
    error: {
      main: red.A400,
    },
  },
  components: {},
});
