const api = "https://api-ca-kjetil-h-h.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    window.location.href = "./login.html";
    return;
  }

  loadUserData(user);
  loadBrands(user.user_id);
});

async function loadUserData(user) {
  const avatar = document.getElementById("avatar");
  const username = document.getElementById("username");
  const email = document.getElementById("email");

  username.textContent = user.username;
  email.textContent = user.email;

  if (user.avatar_image) {
    avatar.style.backgroundImage = `url(${user.avatar_image})`;
    avatar.style.backgroundSize = "cover";
  } else {
    avatar.textContent = user.username
      .split(" ")
      .map((word) => word[0])
      .join("");
  }
}

async function loadBrands(userId) {
  try {
    const response = await fetch(`${api}/users/${userId}/brands`);
    const brands = await response.json();
    const brandList = document.getElementById("brandList");

    brandList.innerHTML = "";

    brands.forEach((brand) => {
      const brandItem = document.createElement("div");
      brandItem.className = "item";

      brandItem.innerHTML = `
          <span>${brand.brand_name}</span>
          <div class="actions">
            <button class="edit-brand" data-id="${brand.brand_id}" data-name="${brand.brand_name}">Edit</button>
            <button class="delete-brand" data-id="${brand.brand_id}">Delete</button>
          </div>
        `;

      brandItem.addEventListener("click", () =>
        loadCollections(brand.brand_id)
      );

      brandItem.querySelector(".edit-brand").addEventListener("click", (e) => {
        e.stopPropagation();
        editBrand(brand.brand_id, brand.brand_name);
      });

      brandItem
        .querySelector(".delete-brand")
        .addEventListener("click", (e) => {
          e.stopPropagation();
          deleteBrand(brand.brand_id, userId);
        });

      brandList.appendChild(brandItem);
    });

    if (!document.getElementById("addBrandButton")) {
      const addBrandButton = document.createElement("button");
      addBrandButton.id = "addBrandButton";
      addBrandButton.textContent = "+ Add Brand";
      addBrandButton.onclick = () => addBrand(userId);
      brandList.appendChild(addBrandButton);
    }
  } catch (error) {
    console.error("Error loading brands:", error);
  }
}

async function editBrand(brandId, currentName) {
  const newBrandName = prompt("Enter the new name for the brand:", currentName);

  if (!newBrandName) {
    alert("Brand name cannot be empty.");
    return;
  }

  try {
    const response = await fetch(`${api}/brands/${brandId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandTitle: newBrandName }),
    });

    if (response.ok) {
      alert("Brand updated successfully!");
      const user = JSON.parse(localStorage.getItem("user"));
      loadBrands(user.user_id);
    } else {
      const error = await response.json();
      alert(`Error updating brand: ${error.error}`);
    }
  } catch (error) {
    console.error("Error updating brand:", error);
  }
}

async function deleteBrand(brandId, userId) {
  if (!confirm("Are you sure you want to delete this brand?")) return;

  try {
    const response = await fetch(`${api}/brands/${brandId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Brand deleted successfully!");
      loadBrands(userId);
    } else {
      const error = await response.json();
      alert(`Error deleting brand: ${error.error}`);
    }
  } catch (error) {
    console.error("Error deleting brand:", error);
  }
}

async function loadCollections(brandId) {
  try {
    const response = await fetch(`${api}/brands/${brandId}/collections`);
    const collections = await response.json();
    const container = document.getElementById("collectionsContainer");

    container.innerHTML = "";

    collections.forEach((collection) => {
      const collectionItem = document.createElement("div");
      collectionItem.className = "item";

      collectionItem.innerHTML = `
        <span>${collection.collection_name}</span>
        <div class="actions">
          <button class="edit-collection" data-id="${collection.collection_id}" data-name="${collection.collection_name}">Edit</button>
          <button class="delete-collection" data-id="${collection.collection_id}">Delete</button>
        </div>
      `;

      container.appendChild(collectionItem);

      const filamentContainer = document.createElement("div");
      filamentContainer.id = `filaments-${collection.collection_id}`;
      filamentContainer.style.display = "none";
      container.appendChild(filamentContainer);

      collectionItem.addEventListener("click", () =>
        toggleFilaments(collection.collection_id)
      );

      loadFilaments(collection.collection_id);
    });

    const addCollectionButton = document.createElement("button");
    addCollectionButton.textContent = "+ Add Collection";
    addCollectionButton.onclick = () => addCollection(brandId);
    container.appendChild(addCollectionButton);
  } catch (error) {
    console.error("Error loading collections:", error);
  }
}

function toggleFilaments(collectionId) {
  const filamentContainer = document.getElementById(
    `filaments-${collectionId}`
  );
  filamentContainer.style.display =
    filamentContainer.style.display === "none" ? "block" : "none";
}

async function loadFilaments(collectionId) {
  try {
    const response = await fetch(
      `${api}/collections/${collectionId}/filaments`
    );
    const filaments = await response.json();
    const container = document.getElementById(`filaments-${collectionId}`);

    container.innerHTML = "";

    filaments.forEach((filament) => {
      const filamentItem = document.createElement("div");
      filamentItem.className = "item";
      filamentItem.textContent = filament.color;

      filamentItem.addEventListener("click", () => showFilamentPopup(filament));

      container.appendChild(filamentItem);
    });

    const addFilamentButton = document.createElement("button");
    addFilamentButton.textContent = "+ Add Filament";
    addFilamentButton.onclick = () => addFilament(collectionId);
    container.appendChild(addFilamentButton);
  } catch (error) {
    console.error("Error loading filaments:", error);
  }
}

function showFilamentPopup(filament) {
  closePopup();

  const popup = document.createElement("div");
  popup.className = "popup";
  popup.setAttribute("data-collection-id", filament.collection_id);

  popup.innerHTML = `
      <div class="popup-content">
        <h3>Filament Details</h3>
        <p><strong>Color:</strong> ${filament.color}</p>
        <p><strong>Type:</strong> ${filament.type || "N/A"}</p>
        <p><strong>Weight:</strong> ${filament.weight || "N/A"} g</p>
        <p><strong>Price:</strong> ${filament.price || "N/A"} </p>
        <p><strong>Purchase Link:</strong> ${
          filament.purchase_link
            ? `<a href="${filament.purchase_link}" target="_blank">View</a>`
            : "N/A"
        }</p>
        <p><strong>Description:</strong> ${filament.description || "N/A"}</p>
        <div class="actions">
          <button id="editFilamentButton">Edit</button>
          <button id="deleteFilamentButton">Delete</button>
          <button id="closePopupButton">Close</button>
        </div>
      </div>
    `;

  document.body.appendChild(popup);

  document
    .getElementById("editFilamentButton")
    .addEventListener("click", () => {
      editFilament(filament.filament_id);
    });

  document
    .getElementById("deleteFilamentButton")
    .addEventListener("click", () => {
      deleteFilament(filament.filament_id);
    });

  document
    .getElementById("closePopupButton")
    .addEventListener("click", closePopup);
}

function closePopup() {
  const popup = document.querySelector(".popup");
  if (popup) {
    popup.remove();
  }
}

async function editFilament(filamentId) {
  try {
    const response = await fetch(`${api}/filaments/${filamentId}`);
    if (!response.ok) {
      alert("Failed to fetch filament details.");
      return;
    }
    const filament = await response.json();

    const color = prompt(
      "Enter the new color for the filament:",
      filament.color
    );
    const type = prompt(
      "Enter the new type for the filament (optional):",
      filament.type
    );
    const weight = prompt(
      "Enter the new weight for the filament in grams (optional):",
      filament.weight
    );
    const price = prompt(
      "Enter the new price for the filament (optional):",
      filament.price
    );
    const purchaseLink = prompt(
      "Enter the new purchase link for the filament (optional):",
      filament.purchase_link
    );
    const description = prompt(
      "Enter the new description for the filament (optional):",
      filament.description
    );

    const updatedData = {
      color: color || filament.color,
      type: type || filament.type,
      weight: weight || filament.weight,
      price: price || filament.price,
      purchaseLink: purchaseLink || filament.purchase_link,
      description: description || filament.description,
    };

    const updateResponse = await fetch(`${api}/filaments/${filamentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (updateResponse.ok) {
      alert("Filament updated successfully!");
      closePopup();
      const collectionId = document
        .querySelector(".popup")
        .getAttribute("data-collection-id");
      loadFilaments(collectionId);
    } else {
      const error = await updateResponse.json();
      alert(`Error updating filament: ${error.error}`);
    }
  } catch (error) {
    console.error("Error updating filament:", error);
  }
}

async function deleteFilament(filamentId) {
  if (!confirm("Are you sure you want to delete this filament?")) return;

  try {
    const popup = document.querySelector(".popup");
    const collectionId = popup
      ? popup.getAttribute("data-collection-id")
      : null;

    const response = await fetch(`${api}/filaments/${filamentId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Filament deleted successfully!");
      closePopup();
      if (collectionId) {
        loadFilaments(collectionId);
      }
    } else {
      const error = await response.json();
      alert(`Error deleting filament: ${error.error}`);
    }
  } catch (error) {
    console.error("Error deleting filament:", error);
  }
}

async function addBrand(userId) {
  const brandName = prompt("Enter the name of the new brand:");
  if (!brandName) return;

  try {
    const response = await fetch(`${api}/users/${userId}/brands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandTitle: brandName }),
    });

    if (response.ok) {
      alert("Brand added successfully!");
      loadBrands(userId);
    } else {
      const error = await response.json();
      alert(`Error adding brand: ${error.error}`);
    }
  } catch (error) {
    console.error("Error adding brand:", error);
  }
}

async function addFilament(collectionId) {
  const color = prompt("Enter the color of the filament:");
  const type = prompt("Enter the type of the filament (optional):");
  const weight = prompt(
    "Enter the weight of the filament in grams (optional):"
  );
  const price = prompt("Enter the price of the filament (optional):");
  const purchaseLink = prompt(
    "Enter a purchase link for the filament (optional):"
  );
  const description = prompt(
    "Enter a description for the filament (optional):"
  );

  if (!color) {
    alert("Filament color is required.");
    return;
  }

  try {
    const response = await fetch(`${api}/filaments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collectionId,
        type: type || null,
        color,
        weight: weight || null,
        price: price || null,
        purchaseLink: purchaseLink || null,
        description: description || null,
      }),
    });

    if (response.ok) {
      alert("Filament added successfully!");
      loadFilaments(collectionId);
    } else {
      const error = await response.json();
      alert(`Error adding filament: ${error.error}`);
    }
  } catch (error) {
    console.error("Error adding filament:", error);
  }
}
