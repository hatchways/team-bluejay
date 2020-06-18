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
    secondary: { main: "#1f1f1f", contrastText: "#fff" },
    error: { main: "#d8000c" },
  },
  overrides: {
    MuiChip: {
      root: {
        borderRadius: 0,
        margin: "5px",
      },
    },
  },
});
