import React from "react";
import Typography from "@mui/material/Typography";
import Content from "./ui/Content";

const FormSubmissionsContent = ({
  title = "Liked Form Submissions",
  submissions = [],
  ...props
}) => {
  return (
    <Content sx={{ marginTop: 3 }}>
      <Typography variant="h4">{title}</Typography>
    </Content>
  );
};

export default FormSubmissionsContent;
