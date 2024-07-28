import { CssBaseline, ThemeProvider } from "@mui/material";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { DefaultTemplate } from "./components/templates/DefaultTemplate.tsx";
import "./index.css";
import { theme } from "./theme.ts";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(Intl.DateTimeFormat().resolvedOptions().timeZone);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DefaultTemplate>
        <App />
      </DefaultTemplate>
    </ThemeProvider>
  </React.StrictMode>,
);
