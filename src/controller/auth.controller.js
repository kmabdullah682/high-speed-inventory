import crypto from "crypto";
import { User } from "../models/Dynamic.model.js";

// Helper function to turn plain text into a secure SHA-256 string
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// 1. ADMIN REGISTER
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const newAdmin = new User({
      name,
      email,
      password: hashPassword(password),
      role: "admin", // Forces admin privileges for this endpoint
    });

    await newAdmin.save();
    return res.status(201).json({
      success: true,
      message: "Admin account created successfully!",
      admin: {
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

// 2. ADMIN LOGIN
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Check if user exists, password matches, and role is admin
    if (
      !user ||
      user.password !== hashPassword(password) ||
      user.role !== "admin"
    ) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or unauthorized access." });
    }

    return res.status(200).json({
      success: true,
      message: `Welcome back, Admin ${user.name}! Authentication verified.`,
      adminId: user._id, // You can send this ID in headers for your other endpoints to check!
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
};
