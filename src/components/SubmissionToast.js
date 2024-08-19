import React, { useEffect, useState } from "react";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Toast from "./ui/Toast";

const SubmissionToast = ({
  toast,
  sx = {
    whiteSpace: "pre-wrap",
  },
  message = "",
  handleClose = () => {
    console.log("Implement a handleClose() function");
  },
  ...props
}) => {
  const [showBorder, setShowBorder] = useState(true);

  // Make new toasts surrounded by red border (all toasts considered new on refresh - potentially could be classified as a bug
  // TODO: Potentially better alternative may to just display a date on all toasts
  useEffect(() => {
    setTimeout(() => {
      setShowBorder(false);
    }, 1500);
  }, []);

  const action = (
    <>
      <Button
        color="secondary"
        size="small"
        onClick={() => props.handleToastLike(toast) || null}
      >
        Like
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => handleClose(toast.id)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  const style = showBorder
    ? { ...sx, border: "2px dotted red", transition: "border 0.3s ease" }
    : sx;

  return <Toast sx={style} message={message} action={action} />;
};

export default SubmissionToast;
