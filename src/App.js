import React, { useState, useEffect, useMemo } from "react";
import FormSubmissionsContent from "./components/FormSubmissionsContent";
import FormSubmissionsHeader from "./components/FormSubmissionsHeader";
import {
  LOCAL_STORAGE_PENDING_SUBMISSIONS,
  LOCAL_STORAGE_LIKED_SUBMISSIONS,
} from "./utils/constants";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import ToastContent from "./components/ToastContent";
import { onMessage } from "./service/mockServer";
import Container from "@mui/material/Container";
import {
  storePendingSubmissions,
  retry,
  filterLocalStorage,
} from "./utils/helpers";
import {
  createMockFormSubmission,
  saveLikedFormSubmission,
  fetchLikedFormSubmissions,
} from "./service/mockServer";

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Memoize toasts and liked_submissions to avoid app flickers
  const toasts = useMemo(
    () => submissions.filter((submission) => !submission.liked),
    [submissions]
  );
  const liked_submissions = useMemo(
    () => submissions.filter((submission) => submission.liked),
    [submissions]
  );

  // Fetch and merge storage data on mount
  useEffect(() => {
    const fetchAndMergeStorage = async () => {
      setLoading(true);
      try {
        // Get the liked submissions in db
        const { formSubmissions } = await retry(
          fetchLikedFormSubmissions,
          3,
          1000
        );

        // Get pending submissions (toasts) from db
        const pendingSubmissions =
          JSON.parse(localStorage.getItem(LOCAL_STORAGE_PENDING_SUBMISSIONS)) ||
          [];

        // Merge both 'liked' and 'pending' (toasts) into one list
        const concatenated = [...formSubmissions, ...pendingSubmissions];
        setSubmissions(concatenated);
      } catch (error) {
        console.error("Failed to fetch liked forms after retries:", error);
      } finally {
        setLoading(false);
      }
    };

    onMessage(storePendingSubmissions);
    fetchAndMergeStorage();
  }, []);

  // Handle submission creation
  const onSubmit = () => {
    try {
      createMockFormSubmission();
      const pendingSubmissions =
        JSON.parse(localStorage.getItem(LOCAL_STORAGE_PENDING_SUBMISSIONS)) ||
        [];

      // Find the submission that was just created
      const newSubmission = pendingSubmissions.filter(
        (submission) =>
          !submissions.some((existing) => existing.id === submission.id)
      );

      // Add it to state
      setSubmissions((prev) => [...prev, ...newSubmission]);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle liking a toast
  const handleToastLike = async (toast) => {
    const saveFormSubmission = () =>
      saveLikedFormSubmission({ ...toast, liked: true });
    setLoading(true);
    try {
      // Request api to put toast into liked submissions table
      await retry(saveFormSubmission, 3, 1000);
      const filteredStorage = filterLocalStorage(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        "id",
        toast.id
      );

      // Remove the toast that was just liked from being a toast any longer
      localStorage.setItem(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        JSON.stringify(filteredStorage)
      );

      // Update state to reflect proper 'liked' value for recently changed submission
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === toast.id
            ? { ...submission, liked: true }
            : submission
        )
      );
    } catch (error) {
      console.error("Failed to save form submission after retries:", error);
      // Optional: Notify user of error
    } finally {
      setLoading(false);
    }
  };

  // Handle closing a toast
  const handleToastClose = (id) => {
    try {
      // Remove toast that user closed from local storage
      const filteredStorage = filterLocalStorage(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        "id",
        id
      );
      localStorage.setItem(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        JSON.stringify(filteredStorage)
      );

      // Update state accordingly to remove the closed toast/submission
      setSubmissions((prev) =>
        prev.filter((submission) => submission.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  // User can delete liked submissions
  const onDelete = (id) => {
    setLoading(true);
    try {
      // Find liked submission user wants to delete & remove it
      const filteredStorage = filterLocalStorage(
        LOCAL_STORAGE_LIKED_SUBMISSIONS,
        "id",
        id
      );

      // Reflect removal in db
      localStorage.setItem(
        LOCAL_STORAGE_LIKED_SUBMISSIONS,
        JSON.stringify(filteredStorage)
      );

      // Update state accordingly
      setSubmissions((prev) =>
        prev.filter((submission) => submission.id !== id)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay open={loading} />
      <FormSubmissionsHeader onSubmit={onSubmit} />
      <Container>
        <FormSubmissionsContent
          title={"Liked Form Submissions"}
          liked_submissions={liked_submissions}
          onDelete={onDelete}
        />
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
