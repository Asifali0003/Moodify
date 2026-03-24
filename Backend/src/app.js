const express = require("express");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const songRouter = require("./routes/song.routes");
const historyRouter = require("./routes/history.routes")
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


// routes pre
app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);
app.use("/api/history", historyRouter)

module.exports = app;