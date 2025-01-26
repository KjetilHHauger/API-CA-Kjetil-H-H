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
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "./profile.html";
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

document.getElementById("registerButton").addEventListener("click", () => {
  document.getElementById("registerPopup").classList.remove("hidden");
});

document.getElementById("closePopupButton").addEventListener("click", () => {
  document.getElementById("registerPopup").classList.add("hidden");
});

document
  .getElementById("registerForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const response = await fetch(`${api}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        document.getElementById("registerPopup").classList.add("hidden"); // Close popup
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration. Please try again.");
    }
  });
