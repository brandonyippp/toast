import React from "react";
import Content from "./ui/Content";
import Toast from "./SubmissionToast";

const ToastContent = ({ toasts = null, handleClose, ...props }) => {
  return (
    <Content
      sx={{
        position: "fixed",
        bottom: 16, // distance from the bottom of the page
        right: 16, // distance from the right side of the page
        zIndex: 9999,
        display: "flex",
        flexDirection: "column-reverse", // This ensures that the newest notification is at the top
        gap: 1, // spacing between notifications
        maxHeight: "80vh", // Adjust this value as needed
        overflowY: "auto", // Enable vertical scrolling
        overflowX: "hidden", // Prevent horizontal scrolling
      }}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          sx={{ whiteSpace: "pre-wrap" }}
          message={`${toast.firstName + " " + toast.lastName}\n${toast.email}`}
          handleClose={handleClose}
          handleToastLike={props.handleToastLike}
        />
      ))}
    </Content>
  );
};

export default ToastContent;
