import express from "express";
import {
  clockIn,
  clockOut,
  getMyAttendance,
  getAllAttendance,
} from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

// Employee routes
router.post("/clock-in", clockIn);
router.post("/clock-out", clockOut);
router.get("/me", getMyAttendance);

// Admin routes
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access only" });
  next();
};

router.get("/", adminOnly, getAllAttendance);

export default router;