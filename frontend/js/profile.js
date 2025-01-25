const api = "https://api-ca-kjetil-h-h.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  const userId = user.user_id;
  document.getElementById("username").textContent = user.username;
  document.getElementById("userAvatar").src = user.profile_image || "https://via.placeholder.com/100";

  // Logout functionality
  document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "./login.html";
  });

  // Update avatar functionality
  document.getElementById("updateAvatarButton").addEventListener("click", async () => {
    const newAvatarUrl = prompt("Enter the new avatar image URL:");
    if (!newAvatarUrl) return;

    try {
      const response = await fetch(`${api}/users/${userId}/avatar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: newAvatarUrl }),
      });

      if (response.ok) {
        document.getElementById("userAvatar").src = newAvatarUrl;
        alert("Avatar updated successfully!");
      } else {
        throw new Error("Failed to update avatar.");
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  });

  // Fetch brands
  try {
    const response = await fetch(`${api}/users/${userId}/brands`);
    const brands = await response.json();

    const brandCards = document.getElementById("brandCards");
    brands.forEach((brand) => {
      const card = document.createElement("div");
      card.className = "brand-card";
      card.innerHTML = `
        <img src="${brand.image || "https://via.placeholder.com/150"}" alt="${brand.brand_name}">
        <h3>${brand.brand_name}</h3>
      `;

      card.addEventListener("click", () => toggleFileExplorer(brand.brand_id, brand.brand_name));
      brandCards.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
  }

  function toggleFileExplorer(brandId, brandName) {
    const fileExplorer = document.createElement("div");
    fileExplorer.className = "file-explorer";

    fileExplorer.innerHTML = `
      <h4>Collections for ${brandName}</h4>
      <button id="addCollectionButton">Add Collection</button>
      <div id="collections-${brandId}" class="collections"></div>
    `;

    document.getElementById("brandCards").appendChild(fileExplorer);

    document.getElementById("addCollectionButton").addEventListener("click", () => {
      togglePopup("addCollectionPopup");
      document.getElementById("addCollectionForm").setAttribute("data-brand-id", brandId);
    });
  }

  function togglePopup(id) {
    document.getElementById(id).classList.toggle("hidden");
  }

  document.getElementById("closeAddCollectionPopup").addEventListener("click", () => {
    togglePopup("addCollectionPopup");
  });

  document.getElementById("closeAddFilamentPopup").addEventListener("click", () => {
    togglePopup("addFilamentPopup");
  });
});
