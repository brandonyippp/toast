import React from "react";
import Header from "./ui/Header";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const FormSubmissionsHeader = ({ onSubmit, ...props }) => {
  return (
    <Header>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Toast Exercise
      </Typography>
      <Button
        variant="contained"
        size="small"
        color="secondary"
        onClick={() => onSubmit()}
      >
        New Submission
      </Button>
    </Header>
  );
};

export default FormSubmissionsHeader;
