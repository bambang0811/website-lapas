import { getPool } from "../config/database.js";

const pool = getPool();

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      "SELECT id, username, role FROM users WHERE username = ? AND password = ? LIMIT 1",
      [username, password],
    );

    if (!rows.length) {
      return res
        .status(401)
        .json({ message: "Username atau password tidak valid" });
    }

    const user = rows[0];
    return res.json({ user, token: "mock-token" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login gagal" });
  }
}
