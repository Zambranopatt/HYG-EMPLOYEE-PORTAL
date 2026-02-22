import Leave from "../models/Leave.js";

// Submit leave request (Employee)
export const submitLeave = async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    const leave = await Leave.create({
      user: req.user.id,
      type,
      startDate,
      endDate,
      reason,
    });
    res.status(201).json({ message: "Leave request submitted", leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View own leave requests (Employee)
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View all leave requests (Admin)
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/Reject leave (Admin)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body; // "Approved" or "Rejected"
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = status;
    await leave.save();
    res.json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};