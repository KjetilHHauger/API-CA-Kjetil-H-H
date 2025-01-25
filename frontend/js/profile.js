const api = "https://api-ca-kjetil-h-h.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  const userId = user.user_id;
  document.getElementById("username").textContent = user.username;

  // Logout 
  document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "./login.html";
  });

  // Fetch and display brands
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

      card.addEventListener("click", () => showCollections(brand.brand_id));
      brandCards.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
  }

  // Show collections
  async function showCollections(brandId) {
    try {
      const response = await fetch(`${api}/brands/${brandId}/collections`);
      const collections = await response.json();

      const brandCards = document.getElementById("brandCards");
      brandCards.innerHTML = ""; 

      collections.forEach((collection) => {
        const card = document.createElement("div");
        card.className = "collection-card";
        card.innerHTML = `<h3>${collection.collection_name}</h3>`;
        brandCards.appendChild(card);
      });

      const addCollectionButton = document.createElement("button");
      addCollectionButton.textContent = "Add Collection";
      addCollectionButton.addEventListener("click", () => {
        togglePopup("createCollectionPopup");
        document
          .getElementById("createCollectionForm")
          .setAttribute("data-brand-id", brandId); 
      });
      brandCards.appendChild(addCollectionButton);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }

  function togglePopup(id) {
    document.getElementById(id).classList.toggle("hidden");
  }

  document.getElementById("closeCreateBrandPopup").addEventListener("click", () => {
    togglePopup("createBrandPopup");
  });

  document.getElementById("closeCreateCollectionPopup").addEventListener("click", () => {
    togglePopup("createCollectionPopup");
  });

  // Create brand
  document.getElementById("createBrandButton").addEventListener("click", () => {
    togglePopup("createBrandPopup");
  });

  document
    .getElementById("createBrandForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const brandName = document.getElementById("brandName").value;
      const brandImage = document.getElementById("brandImage").value;

      try {
        const response = await fetch(`${api}/users/${userId}/brands`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brandTitle: brandName, brandImage }),
        });

        if (!response.ok) {
          throw new Error("Failed to create brand.");
        }

        alert("Brand created successfully!");
        togglePopup("createBrandPopup");
        window.location.reload(); 
      } catch (error) {
        console.error("Error creating brand:", error);
      }
    });

  // Create collection
  document
    .getElementById("createCollectionForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();
      const collectionName = document.getElementById("collectionName").value;
      const brandId = document
        .getElementById("createCollectionForm")
        .getAttribute("data-brand-id");

      try {
        const response = await fetch(`${api}/brands/${brandId}/collections`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collectionName }),
        });

        if (!response.ok) {
          throw new Error("Failed to create collection.");
        }

        alert("Collection created successfully!");
        togglePopup("createCollectionPopup");
        showCollections(brandId);
      } catch (error) {
        console.error("Error creating collection:", error);
      }
    });
});
