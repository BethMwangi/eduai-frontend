import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366F1",
    },
    secondary: {
      main: "#FBBF24",
    },
    background: {
      default: "#F9FAFB",
    },
    text: {
      primary: "#1F2937",
    },
  },
  typography: {
    fontFamily: ["Ubuntu", "sans-serif"].join(","),
  },
});

export default theme;
