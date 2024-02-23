require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoute = require("./routes/auth.route.js");
const globalErrorMiddleware = require("./middlewares/error.middleware.js");
const { CustomError } = require("./utils/error.utils.js");

const app = express();
const PORT = process.env.PORT || 3031;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute)

app.all("*", (req, res, next) => {
    next(new CustomError("invalid route", 404))
})

app.use(globalErrorMiddleware)

connectDB();
app.listen(PORT, () => console.log(`[server] running at ${PORT}`));