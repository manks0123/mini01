document.addEventListener("DOMContentLoaded", function () {
  fetch("http://localhost:3001/profile", {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "User is logged in") {
        alert(`Welcome, ${data.username}`);
      } else {
        alert("Not logged in");
      }
    })
    .catch((error) => console.error("Error fetching profile:", error));
});
