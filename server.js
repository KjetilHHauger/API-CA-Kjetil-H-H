import express from "express";
import cors from "cors";
import pool from "./frontend/js/database.js";

const app = express();

app.use(cors());
app.use(express.json());

// Fetch all users
app.get("/users", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ? AND password_hash = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const user = rows[0];

    res.json({
      message: "Login successful!",
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred during login." });
  }
});

// Update profile image
app.put("/users/:user_id/profile-image", async (req, res) => {
  const userId = Number(req.params.user_id);
  const { profileImage } = req.body;

  if (!userId || !profileImage) {
    return res.status(400).json({ error: "User ID and profile image URL are required." });
  }

  try {
    await pool.execute("UPDATE users SET profile_image = ? WHERE user_id = ?", [
      profileImage,
      userId,
    ]);

    res.status(200).json({ message: "Profile image updated successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile image." });
  }
});

// Add a brand for user
app.post("/users/:user_id/brands", async (req, res) => {
  const userId = Number(req.params.user_id);
  const { brandTitle, brandImage } = req.body;

  if (!userId || !brandTitle) {
    return res.status(400).json({ error: "User ID and brand title are required." });
  }

  try {
    await pool.execute(
      "INSERT INTO brands (user_id, brand_name, image) VALUES (?, ?, ?)",
      [userId, brandTitle, brandImage]
    );

    res.status(201).json({ message: "Brand added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add brand." });
  }
});

// Fetch brands for user
app.get("/users/:user_id/brands", async (req, res) => {
  const userId = Number(req.params.user_id);

  if (!userId) {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  try {
    const [rows] = await pool.execute("SELECT * FROM brands WHERE user_id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No brands found for this user." });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching brands." });
  }
});

// Add a collection to brand
app.post("/brands/:brand_id/collections", async (req, res) => {
  const brandId = Number(req.params.brand_id);
  const { collectionName } = req.body;

  if (!brandId || !collectionName) {
    return res.status(400).json({ error: "Brand ID and collection name are required." });
  }

  try {
    await pool.execute("INSERT INTO collections (brand_id, collection_name) VALUES (?, ?)", [
      brandId,
      collectionName,
    ]);

    res.status(201).json({ message: "Collection added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add collection." });
  }
});

// Fetch collections for brand
app.get("/brands/:brand_id/collections", async (req, res) => {
  const brandId = Number(req.params.brand_id);

  if (!brandId) {
    return res.status(400).json({ error: "Invalid brand ID." });
  }

  try {
    const [rows] = await pool.execute("SELECT * FROM collections WHERE brand_id = ?", [brandId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No collections found for this brand." });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching collections." });
  }
});

// Fetch filaments for collection
app.get("/collections/:collection_id/filaments", async (req, res) => {
  const collectionId = Number(req.params.collection_id);

  if (!collectionId) {
    return res.status(400).json({ error: "Invalid collection ID." });
  }

  try {
    const [rows] = await pool.execute("SELECT * FROM filaments WHERE collection_id = ?", [
      collectionId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No filaments found for this collection." });
    }

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching filaments." });
  }
});

// Add a filament to collection
app.post("/filaments", async (req, res) => {
  const { collectionId, type, color, weight, imageUrl, purchaseLink, description } = req.body;

  if (!collectionId || !type) {
    return res.status(400).json({ error: "Collection ID and type are required." });
  }

  try {
    await pool.execute(
      `INSERT INTO filaments (collection_id, type, color, weight, image_url, purchase_link, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [collectionId, type, color, weight, imageUrl, purchaseLink, description]
    );

    res.status(201).json({ message: "Filament added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add filament." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
