const api = "https://api-ca-kjetil-h-h.onrender.com";

const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "./login.html";
} else {
  const userId = user.user_id;

  document.getElementById("username").textContent = user.username;

  document.getElementById("saveProfileImage").addEventListener("click", async () => {
    const profileImage = document.getElementById("profileImage").value;

    try {
      const response = await fetch(`${api}/users/${userId}/profile-image`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profileImage }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile image.");
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the profile image.");
    }
  });

  document.getElementById("addBrandForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const brandTitle = document.getElementById("brandTitle").value;
    const brandImage = document.getElementById("brandImage").value;

    try {
      const response = await fetch(`${api}/users/${userId}/brands`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brandTitle, brandImage }),
      });

      if (!response.ok) {
        throw new Error("Failed to add brand.");
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the brand.");
    }
  });

  document.getElementById("addFilamentForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const collectionId = document.getElementById("collectionSelect").value;
    const type = document.getElementById("filamentType").value;
    const color = document.getElementById("filamentColor").value;
    const weight = document.getElementById("filamentWeight").value;
    const imageUrl = document.getElementById("filamentImage").value;
    const purchaseLink = document.getElementById("filamentLink").value;
    const description = document.getElementById("filamentDescription").value;

    try {
      const response = await fetch(`${api}/filaments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collectionId, type, color, weight, imageUrl, purchaseLink, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to add filament.");
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the filament.");
    }
  });
}
