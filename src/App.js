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
  filterLocalStorage,
  updateStorageAndState,
} from "./utils/helpers";
import {
  createMockFormSubmission,
  saveLikedFormSubmission,
} from "./service/mockServer";

function App() {
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [likedSubmissions, setLikedSubmissions] = useState([]);

  // Avoid a flicker on initial load by avoiding useState & useEffect loading
  const toasts = useMemo(() => {
    return pendingSubmissions;
  }, [pendingSubmissions]);

  // register the callback for mockServer.js to use whenever new form submission is made.
  useEffect(() => {
    onMessage(storePendingSubmissions);

    setPendingSubmissions(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_PENDING_SUBMISSIONS)) || []
    );

    setLikedSubmissions(
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIKED_SUBMISSIONS))
    );
  }, []);

  // Generates a toast notification with generated user data from mockServer api
  const onSubmit = () => {
    try {
      createMockFormSubmission();

      setPendingSubmissions(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_PENDING_SUBMISSIONS))
      );
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

      // Remove submission from being displayed as a toast
      const filteredStorage = filterLocalStorage(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        "id",
        toast.id
      );
      updateStorageAndState(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        filteredStorage,
        setPendingSubmissions
      );

      setLikedSubmissions(
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIKED_SUBMISSIONS))
      );
    } catch (error) {
      console.error("Failed to save form submission after retries:", error);
      // Handle failure after retries (e.g., notify user or log error)
    }
  };

  // Removes the submission in question from the list, deleted forever
  const handleToastClose = (id) => {
    try {
      const filteredStorage = filterLocalStorage(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        "id",
        id
      );

      // Remove submission from being displayed as a toast
      updateStorageAndState(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        filteredStorage,
        setPendingSubmissions
      );
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
