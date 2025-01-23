import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();

app.use(cors());
app.use(express.json());

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "learning_db",
  port: process.env.DB_PORT || 3306,
});

// fetch("http://localhost:3000/login", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     username: "user1",
//     password: "hashedpassword1",
//   }),
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data))
//   .catch((error) => console.error("Error:", error));
app.get("/", (req, res) => {
  res.send("<h1>MY API!!!!!!</h1>");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const [rows] = await connection.execute(
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
