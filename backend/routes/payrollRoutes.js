import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  generatePayroll,
  getPayrollByUser,
  getAllPayrolls,
  updatePayroll,
} from "../controllers/payrollController.js";

const router = express.Router();
router.use(protect);

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access only" });
  next();
};

// Admin routes
router.post("/", adminOnly, generatePayroll);          // Generate payroll
router.get("/", adminOnly, getAllPayrolls);           // View all payrolls
router.put("/:id", adminOnly, updatePayroll);         // Update payroll

// Employee routes
router.get("/user/:userId", getPayrollByUser);        // Employee or admin view payroll

export default router;