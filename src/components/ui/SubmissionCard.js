import React from "react";
import { Card, CardContent, Typography, Avatar } from "@mui/material";

const SubmissionCard = ({ submission }) => {
  return (
    <Card sx={{ display: "flex", marginBottom: 2 }}>
      <Avatar
        alt={submission.firstName + submission.lastName}
        src={submission.avatarUrl}
        sx={{ width: 56, height: 56, margin: 2 }}
      />
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Typography variant="h6" component="div">
          {submission.firstName} {submission.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {submission.email}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;
