import { LOCAL_STORAGE_PENDING_SUBMISSIONS } from "./constants";

// Assign a callback to the callbacks[] array found in mockServer.js -> stores generated user data on button press
export const storePendingSubmissions = (user_data) => {
  try {
    const {
      id,
      data: { email, firstName, lastName, liked },
    } = user_data;

    // Get pre-existing submissions in local store
    const pendingSubmissions =
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_PENDING_SUBMISSIONS)) || [];

    // Combine the newly-generated submission to pre-existing ones
    const updatedSubmissions = [
      ...pendingSubmissions,
      { id, email, firstName, lastName, liked },
    ];

    // Store into local storage
    localStorage.setItem(
      LOCAL_STORAGE_PENDING_SUBMISSIONS,
      JSON.stringify(updatedSubmissions)
    );
  } catch (error) {
    console.log(error);
  }
};

// Retry an api === retries.value in case of api failure
export const retry = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) {
      throw error; // No more retries left, throw the error
    }
    await new Promise((res) => setTimeout(res, delay)); // Wait for the delay period
    return retry(fn, retries - 1, delay); // Retry with decremented retry count
  }
};

// Filter local storage based on one value exclusion (val)
export const filterLocalStorage = (key, property, val) => {
  const storage = JSON.parse(localStorage.getItem(key));
  const filteredStorage = storage.filter(
    (obj) => obj && obj[`${property}`] !== val
  );

  return filteredStorage;
};

// Update local storage & set state accordingly based on values returned from filterLocalStorage
export const updateStorageAndState = (key, filteredData, setState) => {
  try {
    localStorage.setItem(key, JSON.stringify(filteredData));
    setState(filteredData);
  } catch (error) {
    console.error("Error updating localStorage or state:", error);
  }
};
