import React, { useState, useEffect, useMemo } from "react";
import Container from "@mui/material/Container";
import { onMessage } from "./service/mockServer";
import { storePendingSubmissions } from "./utils/helpers";
import FormSubmissionsContent from "./components/FormSubmissionsContent";
import Header from "./components/ui/Header";
import ToastContent from "./components/ToastContent";

function App() {
  const [pendingSubmissions, setPendingSubmissions] = useState(
    JSON.parse(localStorage.getItem("pendingSubmissions")) || []
  );

  // register the callback for mockServer.js to use whenever new form submission is made.
  useEffect(() => {
    onMessage(storePendingSubmissions);
  }, []);

  // Do it this way so you don't see a flicker on toasts[] components, (e.g) you create a state var for toasts and starts as empty arr
  const toasts = useMemo(() => {
    return pendingSubmissions;
  }, [pendingSubmissions]);

  console.log(toasts);

  return (
    <>
      <Header />
      <Container>
        <FormSubmissionsContent title={"Liked Form Submissions"} />
      </Container>
      <ToastContent toasts={toasts} />
    </>
  );
}

export default App;
