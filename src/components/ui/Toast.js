import React from "react";
import { SnackbarContent, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Toast = ({
  toast,
  sx = { whiteSpace: "pre-wrap" },
  message = "",
  handleClose = () => {
    console.log("Implement a handleClose() function");
  },
  ...props
}) => {
  const handleToastLike = () => {
    props.handleToastLike(toast);
  };

  const action = (
    <>
      <Button color="secondary" size="small" onClick={() => handleToastLike()}>
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

  return <SnackbarContent sx={sx} message={message} action={action} />;
};

export default Toast;
