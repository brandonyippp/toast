import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

//TODO: Maybe add red border to newly-liked forms like we do in SubmissionToast.js, up for debate on whether it is a desirable feature

const SubmissionCard = ({ submission, onDelete }) => {
  return (
    <Card sx={{ display: "flex", marginBottom: 2, position: "relative" }}>
      <Avatar
        alt={submission.firstName + " " + submission.lastName}
        src={submission.avatarUrl}
        sx={{ width: 56, height: 56, margin: 2 }}
      />
      <CardContent sx={{ flex: "1 0 auto", paddingRight: 6 }}>
        <Typography variant="h6" component="div">
          {submission.firstName} {submission.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {submission.email}
        </Typography>
      </CardContent>
      <IconButton
        color="error"
        onClick={() => onDelete(submission.id)}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Card>
  );
};

export default SubmissionCard;
