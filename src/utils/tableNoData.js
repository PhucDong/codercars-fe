import { Typography } from "@mui/material";

// Customize announcement when there's no data in the table
export function CustomNoRowsOverlay() {
  return (
    <Typography sx={{ color: "#70787A", fontWeight: 550 }}>
      No Data Available
    </Typography>
  );
}
