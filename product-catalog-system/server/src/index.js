require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db.js")

const app = express()
const PORT = process.env.PORT || 3031

app.use(cors())
app.use(express.json())

app.listen(PORT, () => {
    connectDB()
    console.log(`[server] running at ${PORT}`);
})