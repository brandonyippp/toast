import { LOCAL_STORAGE_PENDING_SUBMISSIONS } from "./constants";
/**
 * NOTE: There wouldn't be a need to having pendingSubmissions at all, however I have done so for the following reasons:
 *  1. Being unable to edit anything within mockServer.js, I wanted to implement a solution that would allow Toast data to persist
 *      between refreshes, ultimately being a better end-user experience due to not losing potentially vital information on browser
 *      crash or refresh.
 *
 *  2. Expanding on the importance on not being able to edit mockServer.js, if say a new user signed up and was placed into the
 *      formSubmissions localStorage table instead, then the saveLikedFormSubmissions function would simply be doing something along
 *      the lines of "take what's already there and put it in again", which felt redundant.
 */

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
