import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"


import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";


dotenv.config()

const {PORT, DB_URI} = process.env

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(cors())



app.use("/api/employees", employeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);

app.use("/api/payroll", payrollRoutes);

console.log("JWT_SECRET:", process.env.JWT_SECRET);


mongoose.connect(DB_URI).then(() => {
    app.listen( PORT , () => {
        console.log(`Server running on port ${PORT}`)
    })
}).catch((err) => {
    console.error(err.message)
})



