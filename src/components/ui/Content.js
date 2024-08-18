import React from "react";
import { Box } from "@mui/material";

export default function Content({ sx, ...props }) {
  return (
    <Box sx={sx || { marginTop: 3, border: "1px solid red" }}>
      {props.children}
    </Box>
  );
}
