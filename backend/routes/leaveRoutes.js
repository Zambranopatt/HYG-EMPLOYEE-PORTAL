import express from "express";
import {
  submitLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Employee routes
router.post("/", submitLeave);       // submit leave
router.get("/me", getMyLeaves);     // view own leaves

// Admin routes
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access only" });
  next();
};

router.get("/", adminOnly, getAllLeaves);           // view all leave requests
router.put("/:id/status", adminOnly, updateLeaveStatus); // approve/reject leave

export default router;