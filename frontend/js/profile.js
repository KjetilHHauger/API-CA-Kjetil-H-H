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
        loadTypes(brand.brand_id)
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

async function loadTypes(brandId) {
    try {
      const response = await fetch(`${api}/brands/${brandId}/collections`);
      const types = await response.json();
      const container = document.getElementById("collectionsContainer");
  
      container.innerHTML = "";
  
      types.forEach((type) => {
        const typeItem = document.createElement("div");
        typeItem.className = "item";
        typeItem.setAttribute("data-brand-id", brandId);
  
        typeItem.innerHTML = `
          <span>${type.collection_name}</span>
          <div class="actions">
            <button class="edit-type" data-id="${type.collection_id}" data-name="${type.collection_name}">Edit</button>
            <button class="delete-type" data-id="${type.collection_id}">Delete</button>
          </div>
        `;
  
        typeItem.addEventListener("click", () =>
          toggleFilaments(type.collection_id)
        );
  
        typeItem.querySelector(".edit-type").addEventListener("click", (e) => {
          e.stopPropagation();
          editType(type.collection_id, type.collection_name);
        });
  
        typeItem
          .querySelector(".delete-type")
          .addEventListener("click", (e) => {
            e.stopPropagation();
            deleteType(type.collection_id, brandId);
          });
  
        container.appendChild(typeItem);
  
        const filamentContainer = document.createElement("div");
        filamentContainer.id = `filaments-${type.collection_id}`;
        filamentContainer.style.display = "none";
        container.appendChild(filamentContainer);
  
        loadFilaments(type.collection_id);
      });
  
      const addTypeButton = document.createElement("button");
      addTypeButton.textContent = "+ Add Type";
      addTypeButton.onclick = () => addCollection(brandId);
      container.appendChild(addTypeButton);
    } catch (error) {
      console.error("Error loading types:", error);
    }
  }
  
  
  async function editType(typeId, currentName) {
    const newTypeName = prompt("Enter the new name for the type:", currentName);
  
    if (!newTypeName) {
      alert("Type name cannot be empty.");
      return;
    }
  
    try {
      const response = await fetch(`${api}/collections/${typeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collectionName: newTypeName }),
      });
  
      if (response.ok) {
        alert("Type updated successfully!");
        const brandId = document.querySelector(".item").getAttribute("data-brand-id");
        loadTypes(brandId); // Reload types
      } else {
        const error = await response.json();
        alert(`Error updating type: ${error.error}`);
      }
    } catch (error) {
      console.error("Error updating type:", error);
    }
  }
  
  async function deleteType(typeId, brandId) {
    if (!confirm("Are you sure you want to delete this type?")) return;
  
    try {
      const response = await fetch(`${api}/collections/${typeId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        alert("Type deleted successfully!");
        loadTypes(brandId); // Reload types
      } else {
        const error = await response.json();
        alert(`Error deleting type: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting type:", error);
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

async function addCollection(brandId) {
  const collectionName = prompt("Enter the name of the new type:");
  if (!collectionName) return;

  try {
    const response = await fetch(`${api}/brands/${brandId}/collections`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collectionName }),
    });

    if (response.ok) {
      alert("Type added successfully!");
      loadTypes(brandId);
    } else {
      const error = await response.json();
      alert(`Error adding type: ${error.error}`);
    }
  } catch (error) {
    console.error("Error adding type:", error);
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
