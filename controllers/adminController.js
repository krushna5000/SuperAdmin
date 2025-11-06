import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const superAdminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM admins WHERE email=$1 AND role='superadmin'", [email]);
    if (result.rows.length === 0) return res.status(400).json({ message: "SuperAdmin not found" });

    const admin = result.rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
 
    const existingUser = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO admins (name, email, password, role) VALUES ($1,$2,$3,'admin')",
      [name, email, hashed]
    );

    res.status(201).json({ message: "Admin created successfully" });

  } catch (e) {
    console.error("Error creating admin:", e.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAdmins = async (req, res) => {
  const result = await pool.query("SELECT id, name, email FROM admins WHERE role='admin'");
  res.json(result.rows);
};

export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const checkResult = await pool.query("SELECT * FROM admins WHERE id = $1", [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Admin not present" });
    }

    await pool.query(
      "UPDATE admins SET name = $1, email = $2, password = $3 WHERE id = $4",
      [name, email, password, id]
    );

    res.json({ message: "Admin updated successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    
    const checkResult = await pool.query("SELECT * FROM admins WHERE id = $1", [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Admin not present" });
    }

    
    await pool.query("DELETE FROM admins WHERE id = $1", [id]);

    res.json({ message: "Admin deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

