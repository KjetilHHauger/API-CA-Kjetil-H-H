import express from "express";
import cors from "cors";
import pool from "./frontend/js/database.js";

const app = express();

app.use(cors());
app.use(express.json());

// Keep-alive mechanism to prevent idle connection timeouts
setInterval(async () => {
  try {
    const [result] = await pool.execute("SELECT 1");
    console.log("Keep-alive query executed successfully.");
  } catch (err) {
    console.error("Keep-alive query failed:", err);
  }
}, 120000); // 

// Create a new user
app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required." });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, password]
    );

    res.status(201).json({ message: "User created successfully!", user_id: result.insertId });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to create user." });
  }
});

// Update avatar
app.put("/users/:user_id/avatar", async (req, res) => {
  const userId = Number(req.params.user_id);
  const { avatarUrl } = req.body;

  if (!avatarUrl) {
    return res.status(400).json({ error: "Avatar URL is required." });
  }

  try {
    await pool.execute("UPDATE users SET profile_image = ? WHERE user_id = ?", [avatarUrl, userId]);
    res.status(200).json({ message: "Profile image updated successfully!" });
  } catch (err) {
    console.error("Error updating profile image:", err);
    res.status(500).json({ error: "Failed to update profile image." });
  }
});


// Delete brand
app.delete("/brands/:brand_id", async (req, res) => {
  const brandId = Number(req.params.brand_id);

  try {
    await pool.execute("DELETE FROM brands WHERE brand_id = ?", [brandId]);

    res.status(200).json({ message: "Brand deleted successfully!" });
  } catch (err) {
    console.error("Error deleting brand:", err);
    res.status(500).json({ error: "Failed to delete brand." });
  }
});

// Delete collection
app.delete("/collections/:collection_id", async (req, res) => {
  const collectionId = Number(req.params.collection_id);

  try {
    await pool.execute("DELETE FROM collections WHERE collection_id = ?", [collectionId]);

    res.status(200).json({ message: "Collection deleted successfully!" });
  } catch (err) {
    console.error("Error deleting collection:", err);
    res.status(500).json({ error: "Failed to delete collection." });
  }
});

// Delete filament
app.delete("/filaments/:filament_id", async (req, res) => {
  const filamentId = Number(req.params.filament_id);

  try {
    await pool.execute("DELETE FROM filaments WHERE filament_id = ?", [filamentId]);

    res.status(200).json({ message: "Filament deleted successfully!" });
  } catch (err) {
    console.error("Error deleting filament:", err);
    res.status(500).json({ error: "Failed to delete filament." });
  }
});

// Login route
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
      avatar_image: user.profile_image || null,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "An error occurred during login." });
  }
});

// Get brands specific user
app.get("/users/:user_id/brands", async (req, res) => {
  const userId = Number(req.params.user_id);

  try {
    const [rows] = await pool.execute("SELECT * FROM brands WHERE user_id = ?", [userId]);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching brands:", err);
    res.status(500).json({ error: "Failed to fetch brands." });
  }
});

// Add a brand user
app.post("/users/:user_id/brands", async (req, res) => {
  const userId = Number(req.params.user_id);
  const { brandTitle, brandImage } = req.body;

  try {
    await pool.execute(
      "INSERT INTO brands (user_id, brand_name, image) VALUES (?, ?, ?)",
      [userId, brandTitle, brandImage]
    );

    res.status(201).json({ message: "Brand created successfully!" });
  } catch (err) {
    console.error("Error creating brand:", err);
    res.status(500).json({ error: "Failed to create brand." });
  }
});

// Get collections for brand
app.get("/brands/:brand_id/collections", async (req, res) => {
  const brandId = Number(req.params.brand_id);

  try {
    const [rows] = await pool.execute("SELECT * FROM collections WHERE brand_id = ?", [brandId]);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching collections:", err);
    res.status(500).json({ error: "Failed to fetch collections." });
  }
});

// Add collection to brand
app.post("/brands/:brand_id/collections", async (req, res) => {
  const brandId = Number(req.params.brand_id);
  const { collectionName } = req.body;

  try {
    await pool.execute("INSERT INTO collections (brand_id, collection_name) VALUES (?, ?)", [
      brandId,
      collectionName,
    ]);

    res.status(201).json({ message: "Collection created successfully!" });
  } catch (err) {
    console.error("Error creating collection:", err);
    res.status(500).json({ error: "Failed to create collection." });
  }
});

// Get filaments 
app.get("/collections/:collection_id/filaments", async (req, res) => {
  const collectionId = Number(req.params.collection_id);

  try {
    const [rows] = await pool.execute("SELECT * FROM filaments WHERE collection_id = ?", [
      collectionId,
    ]);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching filaments:", err);
    res.status(500).json({ error: "Failed to fetch filaments." });
  }
});

// Add filament to collection
app.post("/filaments", async (req, res) => {
  const { collectionId, type, color, weight, imageUrl, purchaseLink, description } = req.body;

  try {
    await pool.execute(
      `INSERT INTO filaments (collection_id, type, color, weight, image_url, purchase_link, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [collectionId, type, color, weight, imageUrl, purchaseLink, description]
    );

    res.status(201).json({ message: "Filament created successfully!" });
  } catch (err) {
    console.error("Error creating filament:", err);
    res.status(500).json({ error: "Failed to create filament." });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
