import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: '"Montserrat"',
  },
  palette: {
    primary: { main: "#ff743d", contrastText: "#fff" },
    secondary: { main: "#ff510c", contrastText: "#fff" },
    error: { main: "#d8000c" },
    bgcolor: { main: "#f8f8ff" },
  },
  primary: "#f04040",
  secondary: "#1f1f1f",
  error: "#d8000c",
  bgcolor: "#f6f6f6",
});
