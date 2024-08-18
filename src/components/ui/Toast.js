import React from "react";
import { SnackbarContent } from "@mui/material";

const Toast = ({
  toast,
  sx = { whiteSpace: "pre-wrap" },
  message = "",
  ...props
}) => {
  return <SnackbarContent sx={sx} message={message} {...props} />;
};

export default Toast;
