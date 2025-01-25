const api = "https://api-ca-kjetil-h-h.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  const userId = user.user_id;

  const usernameElement = document.getElementById("username");
  if (!usernameElement) {
    console.error("Element with id 'username' not found in the DOM.");
    return;
  }

  usernameElement.textContent = user.username;

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
      fetchBrands();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the brand.");
    }
  });

  async function fetchBrands() {
    try {
      const response = await fetch(`${api}/users/${userId}/brands`);
      if (!response.ok) {
        throw new Error("Failed to fetch brands.");
      }

      const brands = await response.json();
      const brandsDiv = document.getElementById("brands");
      brandsDiv.innerHTML = "<h3>Your Brands:</h3>";

      brands.forEach((brand) => {
        brandsDiv.innerHTML += `
          <div>
            <p>Title: ${brand.brand_name}</p>
            ${
              brand.image
                ? `<img src="${brand.image}" alt="${brand.brand_name}" width="100" />`
                : ""
            }
          </div>
        `;
      });
    } catch (error) {
      console.error("Error fetching brands:", error);
      alert("An error occurred while fetching brands.");
    }
  }

  fetchBrands();

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
      fetchFilaments(collectionId);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the filament.");
    }
  });

  async function fetchFilaments(collectionId) {
    try {
      const response = await fetch(`${api}/collections/${collectionId}/filaments`);
      if (!response.ok) {
        throw new Error("Failed to fetch filaments.");
      }

      const filaments = await response.json();
      const filamentsDiv = document.getElementById("filaments");
      filamentsDiv.innerHTML = "<h3>Your Filaments:</h3>";

      filaments.forEach((filament) => {
        filamentsDiv.innerHTML += `
          <div>
            <p>Type: ${filament.type}</p>
            <p>Color: ${filament.color || "N/A"}</p>
            <p>Weight: ${filament.weight || "N/A"} kg</p>
            ${
              filament.image_url
                ? `<img src="${filament.image_url}" alt="${filament.type}" width="100" />`
                : ""
            }
            ${
              filament.purchase_link
                ? `<p><a href="${filament.purchase_link}" target="_blank">Buy Here</a></p>`
                : "<p>No purchase link provided</p>"
            }
            <p>${filament.description || "No description provided"}</p>
          </div>
        `;
      });
    } catch (error) {
      console.error("Error fetching filaments:", error);
      alert("An error occurred while fetching filaments.");
    }
  }
});
