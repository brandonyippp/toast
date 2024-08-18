import React from "react";
import { Typography } from "@mui/material";
import SubmissionCard from "./SubmissionCard";
import Content from "./ui/Content";

const FormSubmissionsContent = ({
  title = "Liked Form Submissions",
  liked_submissions,
  onDelete,
  ...props
}) => {
  return (
    <Content sx={{ marginTop: 3 }}>
      <Typography variant="h4">{title}</Typography>
      {liked_submissions.map((submission, key) => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          onDelete={onDelete}
        />
      ))}
    </Content>
  );
};

export default FormSubmissionsContent;
