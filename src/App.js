import React, { useState, useEffect, useMemo } from "react";
import FormSubmissionsContent from "./components/FormSubmissionsContent";
import {
  LOCAL_STORAGE_LIKED_SUBMISSIONS,
  LOCAL_STORAGE_PENDING_SUBMISSIONS,
} from "./utils/constants";
import ToastContent from "./components/ToastContent";
import { onMessage } from "./service/mockServer";
import Container from "@mui/material/Container";
import Header from "./components/ui/Header";
import {
  storePendingSubmissions,
  retry,
  mergeLocalStorageArrays,
} from "./utils/helpers";
import {
  createMockFormSubmission,
  saveLikedFormSubmission,
} from "./service/mockServer";

function App() {
  const [submissions, setSubmissions] = useState([]);

  // Avoid a flicker on initial load by avoiding useState & useEffect loading
  const toasts = useMemo(() => {
    return submissions.filter((submission) => !submission.liked);
  }, [submissions]);

  // register the callback for mockServer.js to use whenever new form submission is made.
  useEffect(() => {
    onMessage(storePendingSubmissions);
  }, []);

  // Generates a toast notification with generated user data from mockServer api
  const onSubmit = () => {
    try {
      createMockFormSubmission();
      const storageSubmissions = mergeLocalStorageArrays([
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        LOCAL_STORAGE_LIKED_SUBMISSIONS,
      ]);
      setSubmissions(storageSubmissions);
    } catch (error) {
      console.log(error);
    }
  };

  // Removes 'liked' toast from list of toasts after successfully adding it to the 'liked' list of submissions
  const handleToastLike = async (toast) => {
    const saveFormSubmission = () => saveLikedFormSubmission(toast);
    try {
      const result = await retry(saveFormSubmission, 3, 1000); // Retry up to 3 times with 1 second delay
      console.log(result);
    } catch (error) {
      console.error("Failed to save form submission after retries:", error);
      // Handle failure after retries (e.g., notify user or log error)
    }
  };

  // Removes the submission in question from the list, deleted forever
  const handleToastClose = (id) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header onSubmit={onSubmit} />
      <Container>
        <FormSubmissionsContent title={"Liked Form Submissions"} />
      </Container>
      <ToastContent
        toasts={toasts}
        handleClose={handleToastClose}
        handleToastLike={handleToastLike}
      />
    </>
  );
}

export default App;
