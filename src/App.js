import React, { useState, useEffect, useMemo } from "react";
import Container from "@mui/material/Container";
import { onMessage } from "./service/mockServer";
import { storePendingSubmissions } from "./utils/helpers";
import FormSubmissionsContent from "./components/FormSubmissionsContent";
import Header from "./components/ui/Header";
import ToastContent from "./components/ToastContent";

import { createMockFormSubmission } from "./service/mockServer";

function App() {
  const [pendingSubmissions, setPendingSubmissions] = useState([]);

  // register the callback for mockServer.js to use whenever new form submission is made.
  useEffect(() => {
    onMessage(storePendingSubmissions);

    setPendingSubmissions(
      JSON.parse(localStorage.getItem("pendingSubmissions")) || []
    );
  }, []);

  // Do it this way so you don't see a flicker on toasts[] components, (e.g) you create a state var for toasts and starts as empty arr
  const toasts = useMemo(() => {
    return pendingSubmissions;
  }, [pendingSubmissions]);

  // User presses "New Submission" button
  const onSubmit = () => {
    createMockFormSubmission();

    setPendingSubmissions(
      JSON.parse(localStorage.getItem("pendingSubmissions"))
    );
  };

  // localStorage.clear();

  return (
    <>
      <Header onSubmit={onSubmit} />
      <Container>
        <FormSubmissionsContent title={"Liked Form Submissions"} />
      </Container>
      <ToastContent toasts={toasts} />
    </>
  );
}

export default App;
