const api = "https://api-ca-kjetil-h-h.onrender.com";

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        document.getElementById(
          "result"
        ).innerText = `Welcome, ${data.username}!`;
      } else {
        document.getElementById("result").innerText =
          data.error || "Login failed";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("result").innerText =
        "An error occurred. Please try again.";
    }
  });
