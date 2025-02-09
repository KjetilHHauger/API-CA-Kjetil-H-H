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
}, 120000); 

// Create a new user
app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required." });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, password]
    );

    res
      .status(201)
      .json({ message: "User created successfully!", user_id: result.insertId });
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
    await pool.execute("UPDATE users SET profile_image = ? WHERE user_id = ?", [
      avatarUrl,
      userId,
    ]);
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
    await pool.execute("DELETE FROM collections WHERE collection_id = ?", [
      collectionId,
    ]);
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
    await pool.execute("DELETE FROM filaments WHERE filament_id = ?", [
      filamentId,
    ]);
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
    return res
      .status(400)
      .json({ error: "Username and password are required." });
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
    const [rows] = await pool.execute(
      "SELECT * FROM brands WHERE user_id = ?",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching brands:", err);
    res.status(500).json({ error: "Failed to fetch brands." });
  }
});

// Add brand for a user
app.post("/users/:user_id/brands", async (req, res) => {
  const userId = Number(req.params.user_id);
  const { brandTitle, brandImage } = req.body;

  if (!brandTitle) {
    return res.status(400).json({ error: "Brand title is required." });
  }

  try {
    await pool.execute(
      "INSERT INTO brands (user_id, brand_name, image) VALUES (?, ?, ?)",
      [userId, brandTitle, brandImage || null]
    );

    res.status(201).json({ message: "Brand created successfully!" });
  } catch (err) {
    console.error("Error creating brand:", err);
    res.status(500).json({ error: "Failed to create brand." });
  }
});

// Update brand
app.put("/brands/:brand_id", async (req, res) => {
  const brandId = Number(req.params.brand_id);
  const { brandTitle, brandImage } = req.body;

  if (!brandTitle) {
    return res.status(400).json({ error: "Brand title is required." });
  }

  try {
    await pool.execute(
      "UPDATE brands SET brand_name = ?, image = ? WHERE brand_id = ?",
      [brandTitle, brandImage || null, brandId]
    );
    res.status(200).json({ message: "Brand updated successfully!" });
  } catch (err) {
    console.error("Error updating brand:", err);
    res.status(500).json({ error: "Failed to update brand." });
  }
});


// Get collections for brand
app.get("/brands/:brand_id/collections", async (req, res) => {
  const brandId = Number(req.params.brand_id);

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM collections WHERE brand_id = ?",
      [brandId]
    );
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

  if (!collectionName) {
    return res
      .status(400)
      .json({ error: "Collection name is required." });
  }

  try {
    await pool.execute(
      "INSERT INTO collections (brand_id, collection_name) VALUES (?, ?)",
      [brandId, collectionName]
    );
    res.status(201).json({ message: "Collection created successfully!" });
  } catch (err) {
    console.error("Error creating collection:", err);
    res.status(500).json({ error: "Failed to create collection." });
  }
});

// Update collection
app.put("/collections/:collection_id", async (req, res) => {
  const collectionId = Number(req.params.collection_id);
  const { collectionName } = req.body;

  if (!collectionName) {
    return res.status(400).json({ error: "Collection name is required." });
  }

  try {
    await pool.execute(
      "UPDATE collections SET collection_name = ? WHERE collection_id = ?",
      [collectionName, collectionId]
    );
    res.status(200).json({ message: "Collection updated successfully!" });
  } catch (err) {
    console.error("Error updating collection:", err);
    res.status(500).json({ error: "Failed to update collection." });
  }
});


// Get filaments
app.get("/collections/:collection_id/filaments", async (req, res) => {
  const collectionId = Number(req.params.collection_id);

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM filaments WHERE collection_id = ?",
      [collectionId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching filaments:", err);
    res.status(500).json({ error: "Failed to fetch filaments." });
  }
});

// Get a single filament by ID
app.get("/filaments/:filament_id", async (req, res) => {
  const filamentId = Number(req.params.filament_id);

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM filaments WHERE filament_id = ?",
      [filamentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Filament not found." });
    }

    res.json(rows[0]); 
  } catch (err) {
    console.error("Error fetching filament:", err);
    res.status(500).json({ error: "Failed to fetch filament." });
  }
});


app.post("/filaments", async (req, res) => {
  const {
    collectionId,
    type,
    color,
    weight,
    imageUrl,
    purchaseLink,
    description,
  } = req.body;

  if (!collectionId || !color) {
    return res
      .status(400)
      .json({ error: "Collection ID and Color are required." });
  }

  try {
    await pool.execute(
      `INSERT INTO filaments (collection_id, type, color, weight, image_url, purchase_link, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        collectionId,
        type || null,
        color || null,
        weight || null,
        imageUrl || null,
        purchaseLink || null,
        description || null,
      ]
    );

    res.status(201).json({ message: "Filament created successfully!" });
  } catch (error) {
    console.error("Error creating filament:", error);
    res.status(500).json({ error: "Failed to create filament." });
  }
});


// Update filament
app.put("/filaments/:filament_id", async (req, res) => {
  const filamentId = Number(req.params.filament_id);
  const { type, color, weight, price, imageUrl, purchaseLink, description } = req.body;

  const updates = [];
  const values = [];

  if (type !== undefined) {
    updates.push('type = ?');
    values.push(type);
  }
  if (color !== undefined) {
    updates.push('color = ?');
    values.push(color);
  }
  if (weight !== undefined) {
    updates.push('weight = ?');
    values.push(weight);
  }
  if (price !== undefined) {
    updates.push('price = ?');
    values.push(price);
  }
  if (imageUrl !== undefined) {
    updates.push('image_url = ?');
    values.push(imageUrl);
  }
  if (purchaseLink !== undefined) {
    updates.push('purchase_link = ?');
    values.push(purchaseLink);
  }
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields to update." });
  }

  values.push(filamentId);

  const sql = `UPDATE filaments SET ${updates.join(', ')} WHERE filament_id = ?`;

  try {
    await pool.execute(sql, values);
    res.status(200).json({ message: "Filament updated successfully!" });
  } catch (error) {
    console.error("Error updating filament:", error);
    res.status(500).json({ error: "Failed to update filament." });
  }
});



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
