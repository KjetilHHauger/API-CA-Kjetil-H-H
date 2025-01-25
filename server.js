import express from "express";
import cors from "cors";
import pool from "./frontend/js/database.js";

const app = express();

app.use(cors());
app.use(express.json());

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

// Single user brands
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

// Brands collections
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


// Collection filaments
app.post("/collections/:collection_id/filaments", async (req, res) => {
  const { collection_id } = req.params;
  const { type, image_url, purchase_link, description } = req.body;

  if (!type) {
    return res.status(400).json({ error: "Filament type is required." });
  }

  try {
    await pool.execute(
      "INSERT INTO filaments (collection_id, type, image_url, purchase_link, description) VALUES (?, ?, ?, ?, ?)",
      [collection_id, type, image_url, purchase_link, description]
    );

    res.status(201).json({ message: "Filament added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while adding the filament." });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
