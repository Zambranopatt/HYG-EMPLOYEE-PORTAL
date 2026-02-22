import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes with JWT
router.use(protect);

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access only" });
  next();
};

// Routes
router.get("/", adminOnly, getAllEmployees); // Get all employees
router.get("/:id", getEmployeeById);         // Get one employee
router.post("/", adminOnly, createEmployee); // Create new employee
router.put("/:id", adminOnly, updateEmployee); // Update employee
router.delete("/:id", adminOnly, deleteEmployee); // Delete employee

export default router;