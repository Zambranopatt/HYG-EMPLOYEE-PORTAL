import Leave from "../models/Leave.js";
import { logAction } from "../utils/logAction.js";

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

    // ✅ Audit log
    await logAction({
      userId: req.user.id,
      action: "SUBMITTED_LEAVE",
      targetId: leave._id,
      targetModel: "Leave",
      details: `Leave request submitted from ${startDate} to ${endDate}, type: ${type}`,
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
    const leaves = await Leave.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Optional: log viewing all leaves
    // await logAction({
    //   userId: req.user.id,
    //   action: "VIEWED_ALL_LEAVES",
    //   targetModel: "Leave",
    //   details: `Admin viewed all leave requests`,
    // });

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

    // ✅ Audit log
    await logAction({
      userId: req.user.id,
      action: status === "Approved" ? "APPROVED_LEAVE" : "REJECTED_LEAVE",
      targetId: leave._id,
      targetModel: "Leave",
      details: `Leave ${status.toLowerCase()} for user ${leave.user}`,
    });

    res.json({ message: `Leave ${status.toLowerCase()}`, leave });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};