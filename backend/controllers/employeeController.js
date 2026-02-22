import User from "../models/User.js";
import { logAction } from "../utils/logAction.js";

// GET ALL EMPLOYEES (Admin only)
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE EMPLOYEE BY ID (Admin or Employee themselves)
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-password");
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE NEW EMPLOYEE (Admin only)
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, department, position } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Employee already exists" });

    const bcrypt = await import("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newEmployee = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      department,
      position,
    });

    // ✅ Audit log
    await logAction({
      userId: req.user.id, // Admin creating
      action: "CREATED_EMPLOYEE",
      targetId: newEmployee._id,
      targetModel: "User",
      details: `Employee ${newEmployee.name} (${newEmployee.email}) created`,
    });

    res.status(201).json({ message: "Employee created", newEmployee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE EMPLOYEE (Admin only)
export const updateEmployee = async (req, res) => {
  try {
    const { name, email, department, position } = req.body;

    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.department = department || employee.department;
    employee.position = position || employee.position;

    await employee.save();

    // ✅ Audit log
    await logAction({
      userId: req.user.id, // Admin updating
      action: "UPDATED_EMPLOYEE",
      targetId: employee._id,
      targetModel: "User",
      details: `Employee updated: name=${employee.name}, email=${employee.email}, department=${employee.department}, position=${employee.position}`,
    });

    res.json({ message: "Employee updated", employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE EMPLOYEE (Admin only)
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    await employee.deleteOne();

    // ✅ Audit log
    await logAction({
      userId: req.user.id, // Admin deleting
      action: "DELETED_EMPLOYEE",
      targetId: employee._id,
      targetModel: "User",
      details: `Employee ${employee.name} (${employee.email}) deleted`,
    });

    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};