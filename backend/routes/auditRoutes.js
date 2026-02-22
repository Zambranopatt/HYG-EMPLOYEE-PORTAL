import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorize.js";
import AuditLog from "../models/AuditLog.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("superadmin", "admin"),
  async (req, res) => {
    const logs = await AuditLog.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 });

    res.json(logs);
  }
);

export default router;