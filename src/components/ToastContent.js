import React from "react";
import Content from "./ui/Content";
import { Snackbar } from "@mui/material";

const ToastContent = ({ toasts = [], ...props }) => {
  return (
    <Content
      sx={{
        position: "fixed",
        bottom: 16, // distance from the bottom of the page
        right: 16, // distance from the right side of the page
        zIndex: 9999,
        display: "flex",
        flexDirection: "column-reverse", // This ensures that the newest notification is at the bottom
        gap: 1, // spacing between notifications
        border: "1px solid red",
      }}
    ></Content>
  );
};

export default ToastContent;
