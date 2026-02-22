import Payroll from "../models/Payroll.js";
import User from "../models/User.js";
import { logAction } from "../utils/logAction.js";

// Create / Generate Payroll (Admin)
export const generatePayroll = async (req, res) => {
  try {
    const { userId, baseSalary, bonuses = 0, deductions = 0, leaveDeduction = 0, month, year } = req.body;

    // Check if payroll for this month/year already exists
    const existing = await Payroll.findOne({ user: userId, month, year });
    if (existing)
      return res.status(400).json({
        message: "Payroll already exists for this employee for this month",
      });

    const totalSalary = baseSalary + bonuses - deductions - leaveDeduction;

    const payroll = await Payroll.create({
      user: userId,
      baseSalary,
      bonuses,
      deductions,
      leaveDeduction,
      month,
      year,
      totalSalary,
    });

    // ✅ Audit Log
    await logAction({
      userId: req.user.id,
      action: "GENERATED_PAYROLL",
      targetId: payroll._id,
      targetModel: "Payroll",
      details: `Payroll generated for ${month}/${year}`,
    });

    res.status(201).json({ message: "Payroll generated", payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Payroll of a single employee (Employee or Admin)
export const getPayrollByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // If employee, make sure they only access their own payroll
    if (req.user.role !== "admin" && req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const payrolls = await Payroll.find({ user: userId }).sort({ year: -1, month: -1 });

    // Optional: log viewing payrolls if desired
    // await logAction({
    //   userId: req.user.id,
    //   action: "VIEWED_PAYROLL",
    //   targetId: userId,
    //   targetModel: "Payroll",
    //   details: `Viewed payroll history`,
    // });

    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Payrolls (Admin)
export const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("user", "name email department position")
      .sort({ year: -1, month: -1 });

    // Optional: log viewing all payrolls
    // await logAction({
    //   userId: req.user.id,
    //   action: "VIEWED_ALL_PAYROLLS",
    //   details: `Admin viewed all payrolls`,
    // });

    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Payroll (Admin)
export const updatePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) return res.status(404).json({ message: "Payroll not found" });

    const { bonuses, deductions, leaveDeduction } = req.body;

    payroll.bonuses = bonuses ?? payroll.bonuses;
    payroll.deductions = deductions ?? payroll.deductions;
    payroll.leaveDeduction = leaveDeduction ?? payroll.leaveDeduction;
    payroll.totalSalary = payroll.baseSalary + payroll.bonuses - payroll.deductions - payroll.leaveDeduction;

    await payroll.save();

    // ✅ Audit Log
    await logAction({
      userId: req.user.id,
      action: "UPDATED_PAYROLL",
      targetId: payroll._id,
      targetModel: "Payroll",
      details: `Payroll updated: bonuses=${payroll.bonuses}, deductions=${payroll.deductions}, leaveDeduction=${payroll.leaveDeduction}`,
    });

    res.json({ message: "Payroll updated", payroll });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};