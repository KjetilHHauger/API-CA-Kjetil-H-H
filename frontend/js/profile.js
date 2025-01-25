const api = "https://api-ca-kjetil-h-h.onrender.com";

const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "./login.html";
} else {
  const userId = user.user_id;

  const profileDetails = document.getElementById("profileDetails");
  profileDetails.innerHTML = `
    <p>Username: ${user.username}</p>
    <label for="profileImage">Profile Image URL:</label>
    <input type="url" id="profileImage" name="profileImage" />
    <br />
    <button id="saveProfileImage">Save Profile Image</button>
  `;

  document.getElementById("addBrandForm").addEventListener("submit", async function (event) {
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

      const data = await response.json();
      if (response.ok) {
        alert("Brand added successfully!");
        fetchBrands();
      } else {
        alert(data.error || "Failed to add brand.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });

  async function fetchBrands() {
    try {
      const response = await fetch(`${api}/users/${userId}/brands`);
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
    }
  }
  fetchBrands();

  async function fetchCollections(brandId) {
    try {
      const response = await fetch(`${api}/brands/${brandId}/collections`);
      const collections = await response.json();

      const collectionSelect = document.getElementById("collectionSelect");
      collectionSelect.innerHTML = "";

      collections.forEach((collection) => {
        const option = document.createElement("option");
        option.value = collection.collection_id;
        option.textContent = collection.collection_name;
        collectionSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }

  document.getElementById("addFilamentForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const collectionId = document.getElementById("collectionSelect").value;
    const filamentType = document.getElementById("filamentType").value;
    const filamentImage = document.getElementById("filamentImage").value;
    const filamentLink = document.getElementById("filamentLink").value;
    const filamentDescription = document.getElementById("filamentDescription").value;

    try {
      const response = await fetch(`${api}/collections/${collectionId}/filaments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: filamentType,
          image_url: filamentImage,
          purchase_link: filamentLink,
          description: filamentDescription,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Filament added successfully!");
        fetchFilaments(collectionId);
      } else {
        alert(data.error || "Failed to add filament.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });

  async function fetchFilaments(collectionId) {
    try {
      const response = await fetch(`${api}/collections/${collectionId}/filaments`);
      const filaments = await response.json();

      const filamentsDiv = document.getElementById("filaments");
      filamentsDiv.innerHTML = "<h3>Your Filaments:</h3>";
      filaments.forEach((filament) => {
        filamentsDiv.innerHTML += `
          <div>
            <p>Type: ${filament.type}</p>
            <p>Description: ${filament.description || "No description provided"}</p>
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
          </div>
        `;
      });
    } catch (error) {
      console.error("Error fetching filaments:", error);
    }
  }
}
