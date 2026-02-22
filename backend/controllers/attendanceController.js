import Attendance from "../models/Attendance.js";

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

    res.json({ message: "Clocked out", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get own attendance (Employee)
export const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user.id }).sort({ clockIn: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all attendance (Admin)
export const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("user", "name email").sort({ clockIn: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};