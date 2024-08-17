/* NOTE: I do not currently see the purpose of looping over numerous callbacks to deal with the generated user data appropriately
    for the purposes of displaying a toast. There should be an alignment of your schema (indicated below) and the data returned from
    endpoint/server, and should be addressed accordingly by adjusting one or the other in the case that there isn't, so this solution
    makes more sense to me
*/

/* callback to be pushed into callbacks[] in mockServer.js on App.js initial load. Stores generated user data into localStorage
    to display as a toast, and persists through refreshes (may want this functionality in case of browser crash to avoid
    user being lost forever prior to having an opportunity to click 'Like')
*/
export const storePendingSubmissions = (user_data) => {
  try {
    const {
      id,
      data: { email, firstName, lastName, liked },
    } = user_data;

    const pendingSubmissions =
      JSON.parse(localStorage.getItem("pendingSubmissions")) || [];

    const updatedSubmissions = [
      ...pendingSubmissions,
      { id, email, firstName, lastName, liked },
    ];

    localStorage.setItem(
      "pendingSubmissions",
      JSON.stringify(updatedSubmissions)
    );
  } catch (error) {
    console.log(error);
  }
};
