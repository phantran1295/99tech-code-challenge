import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./styles/global.scss";
import App from "./App.tsx";

const fontStack =
  "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";

const RADIUS = 12;

const theme = createTheme({
  shape: { borderRadius: RADIUS },
  palette: {
    primary: {
      main: "#f06d39",
      contrastText: "#fff",
    },
    text: {
      primary: "#333",
    },
  },
  typography: {
    fontFamily: fontStack,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: fontStack,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { backgroundColor: "#fff" } },
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: RADIUS, boxShadow: "none" } },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
