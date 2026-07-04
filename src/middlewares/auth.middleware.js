// middleware/auth.js
import { User } from "../models/Dynamic.model.js";

export const protectAdminRoute = async (req, res, next) => {
  const adminId = req.headers["admin-id"]; // Looks for 'admin-id' in Postman headers

  if (!adminId) {
    return res
      .status(403)
      .json({ message: "Access denied. No admin ID provided." });
  }

  try {
    const user = await User.findById(adminId);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. User is not an authorized admin." });
    }

    next(); // Pass control to the next controller
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid admin authentication state." });
  }
};
