import React, { useState, useEffect, useMemo } from "react";
import FormSubmissionsContent from "./components/FormSubmissionsContent";
import FormSubmissionsHeader from "./components/FormSubmissionsHeader";
import { LOCAL_STORAGE_PENDING_SUBMISSIONS } from "./utils/constants";
import LoadingOverlay from "./components/ui/LoadingOverlay";
import ToastContent from "./components/ToastContent";
import { onMessage } from "./service/mockServer";
import Container from "@mui/material/Container";
import Header from "./components/ui/Header";
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

  // Memoize toasts and liked_submissions
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
        const { formSubmissions } = await retry(
          fetchLikedFormSubmissions,
          3,
          1000
        );
        const pendingSubmissions =
          JSON.parse(localStorage.getItem(LOCAL_STORAGE_PENDING_SUBMISSIONS)) ||
          [];
        const concatenated = [...formSubmissions, ...pendingSubmissions];
        setSubmissions(concatenated);
      } catch (error) {
        console.error("Failed to fetch liked forms after retries:", error);
        // Optional: Notify user of error
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
      const newSubmissions = pendingSubmissions.filter(
        (submission) =>
          !submissions.some((existing) => existing.id === submission.id)
      );
      setSubmissions((prev) => [...prev, ...newSubmissions]);
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
      await retry(saveFormSubmission, 3, 1000);
      const filteredStorage = filterLocalStorage(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        "id",
        toast.id
      );
      localStorage.setItem(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        JSON.stringify(filteredStorage)
      );
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
      const filteredStorage = filterLocalStorage(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        "id",
        id
      );
      localStorage.setItem(
        LOCAL_STORAGE_PENDING_SUBMISSIONS,
        JSON.stringify(filteredStorage)
      );
      setSubmissions((prev) =>
        prev.filter((submission) => submission.id !== id)
      );
    } catch (error) {
      console.log(error);
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
