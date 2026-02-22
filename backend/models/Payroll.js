import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    baseSalary: { type: Number, required: true },
    bonuses: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    leaveDeduction: { type: Number, default: 0 }, // optional: auto calculate from leave
    month: { type: Number, required: true },       // 1-12
    year: { type: Number, required: true },
    totalSalary: { type: Number },                 // computed
    payslipGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);