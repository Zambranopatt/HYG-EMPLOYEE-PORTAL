import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorize.js";
import {
  generatePayroll,
  getPayrollByUser,
  getAllPayrolls,
  updatePayroll,
} from "../controllers/payrollController.js";

const router = express.Router();

// Admin / HR routes
router.post(
  "/",
  protect,
  authorizeRoles("superadmin", "hr"),
  generatePayroll
);

router.get(
  "/",
  protect,
  authorizeRoles("superadmin", "admin", "hr"),
  getAllPayrolls
);

router.put(
  "/:id",
  protect,
  authorizeRoles("superadmin", "hr"),
  updatePayroll
);

// Employee or admin view payroll
router.get(
  "/user/:userId",
  protect,
  authorizeRoles("superadmin", "admin", "hr", "employee"),
  getPayrollByUser
);

export default router;