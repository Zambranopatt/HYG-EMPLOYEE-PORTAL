import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import cors from "cors"
import mongoose from "mongoose"

dotenv.config()

const {PORT, DB_URI} = process.env

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello world!")
})


mongoose.connect(DB_URI).then(() => {
    app.listen( PORT , () => {
    console.log(`Server running on port ${PORT}`)
})
}).catch((err) => {
    console.error(err.message)
})



