import { Typography } from "@mui/material";
import React from "react";

const Copyright = () => {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      sx={{ py: "8px", mt: "20px" }}
    >
      &copy; Copyright {new Date().getFullYear()} by Phuc Dong
    </Typography>
  );
};

export default Copyright;
