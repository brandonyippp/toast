import React from "react";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Toast from "./ui/Toast";

const SubmissionToast = ({
  toast,
  sx = { whiteSpace: "pre-wrap" },
  message = "",
  handleClose = () => {
    console.log("Implement a handleClose() function");
  },
  ...props
}) => {
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

  return <Toast sx={sx} message={message} action={action} />;
};

export default SubmissionToast;
