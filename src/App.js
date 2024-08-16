import Router from "./routes";
import ThemeProvider from "./theme";
import "./App.css";
import { Box, Typography } from "@mui/material";
import Copyright from "./components/Copyright";

function App() {
  return (
    <ThemeProvider>
      <Box
        className="hero-image"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h1" color="white" className="title">
          CODERCAR DATABASE
        </Typography>
      </Box>
      <Router />
      <Copyright />
    </ThemeProvider>
  );
}

export default App;
