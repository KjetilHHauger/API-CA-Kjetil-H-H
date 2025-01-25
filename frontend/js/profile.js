const api = "https://api-ca-kjetil-h-h.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  const userId = user.user_id;
  document.getElementById("username").textContent = user.username;

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

  async function showCollections(brandId) {
    try {
      const response = await fetch(`${api}/brands/${brandId}/collections`);
      const collections = await response.json();

      const brandCards = document.getElementById("brandCards");
      brandCards.innerHTML = ""; // Clear current cards

      collections.forEach((collection) => {
        const card = document.createElement("div");
        card.className = "brand-card";
        card.innerHTML = `<h3>${collection.collection_name}</h3>`;
        card.addEventListener("click", () => showFilaments(collection.collection_id));
        brandCards.appendChild(card);
      });
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  }

  async function showFilaments(collectionId) {
    try {
      const response = await fetch(`${api}/collections/${collectionId}/filaments`);
      const filaments = await response.json();

      const brandCards = document.getElementById("brandCards");
      brandCards.innerHTML = ""; // Clear current cards

      filaments.forEach((filament) => {
        const card = document.createElement("div");
        card.className = "brand-card";
        card.innerHTML = `
          <h3>${filament.type}</h3>
          <p>${filament.color}</p>
        `;

        card.addEventListener("click", () => showFilamentDetails(filament));
        brandCards.appendChild(card);
      });

      const addButton = document.createElement("button");
      addButton.textContent = "Add Filament";
      addButton.addEventListener("click", () => togglePopup("addFilamentPopup"));
      brandCards.appendChild(addButton);
    } catch (error) {
      console.error("Error fetching filaments:", error);
    }
  }

  function showFilamentDetails(filament) {
    document.getElementById("filamentTitle").textContent = filament.type;
    document.getElementById("filamentImage").src = filament.image_url || "";
    document.getElementById("filamentDescription").textContent = `Description: ${filament.description}`;
    document.getElementById("filamentWeight").textContent = `Weight: ${filament.weight} kg`;
    document.getElementById("filamentType").textContent = `Type: ${filament.type}`;
    document.getElementById("filamentColor").textContent = `Color: ${filament.color}`;
    document.getElementById("filamentLink").href = filament.purchase_link || "#";

    togglePopup("filamentDetailsPopup");
  }

  function togglePopup(id) {
    document.getElementById(id).classList.toggle("hidden");
  }

  document.getElementById("closeFilamentDetailsPopup").addEventListener("click", () => {
    togglePopup("filamentDetailsPopup");
  });

  document.getElementById("closeAddFilamentPopup").addEventListener("click", () => {
    togglePopup("addFilamentPopup");
  });

  document.getElementById("addFilamentForm").addEventListener("submit", async (event) => {
    event.preventDefault();

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
        body: JSON.stringify({ type, color, weight, imageUrl, purchaseLink, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to add filament.");
      }

      alert("Filament added successfully!");
      togglePopup("addFilamentPopup");
    } catch (error) {
      console.error("Error adding filament:", error);
    }
  });
});
