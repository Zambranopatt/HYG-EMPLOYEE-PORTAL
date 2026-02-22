import Attendance from "../models/Attendance.js";
import { logAction } from "../utils/logAction.js";

// Clock in (Employee)
export const clockIn = async (req, res) => {
  try {
    const today = new Date();
    const existing = await Attendance.findOne({
      user: req.user.id,
      clockIn: { $gte: new Date(today.setHours(0,0,0,0)) },
    });

    if (existing) return res.status(400).json({ message: "Already clocked in today" });

    const attendance = await Attendance.create({
      user: req.user.id,
      clockIn: new Date(),
    });

    // ✅ Audit log
    await logAction({
      userId: req.user.id,
      action: "CLOCK_IN",
      targetId: attendance._id,
      targetModel: "Attendance",
      details: `Employee clocked in at ${attendance.clockIn}`,
    });

    res.status(201).json({ message: "Clocked in", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clock out (Employee)
export const clockOut = async (req, res) => {
  try {
    const attendance = await Attendance.findOne({
      user: req.user.id,
      clockOut: null,
    }).sort({ clockIn: -1 });

    if (!attendance) return res.status(400).json({ message: "No active clock-in found" });

    attendance.clockOut = new Date();
    await attendance.save();

    // ✅ Audit log
    await logAction({
      userId: req.user.id,
      action: "CLOCK_OUT",
      targetId: attendance._id,
      targetModel: "Attendance",
      details: `Employee clocked out at ${attendance.clockOut}`,
    });

    res.json({ message: "Clocked out", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get own attendance (Employee)
export const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user.id }).sort({ clockIn: -1 });

    // Optional: log viewing own attendance
    // await logAction({
    //   userId: req.user.id,
    //   action: "VIEWED_OWN_ATTENDANCE",
    //   targetModel: "Attendance",
    //   details: `Employee viewed own attendance history`,
    // });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance (Admin)
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("user", "name email")
      .sort({ clockIn: -1 });

    // Optional: log admin viewing all attendance
    // await logAction({
    //   userId: req.user.id,
    //   action: "VIEWED_ALL_ATTENDANCE",
    //   targetModel: "Attendance",
    //   details: `Admin viewed all attendance records`,
    // });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};