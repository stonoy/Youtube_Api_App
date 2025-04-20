const express = require('express')
require("express-async-errors")
require("dotenv").config()
const cors = require("cors")
const connectDB = require('./config')
const errorMiddleware = require('./middlewares/errorMiddleware')
const createError = require('./errorClass')
const Log = require('./models/log')
const path = require("path")
const ytRouter = require('./routes/youtube')

const app = express()

app.use(express.static(path.resolve(__dirname, "./client/dist"))); // PROVIDING FRONTEND APP

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())

app.use("/api/v1/yt", ytRouter)

app.use("*", (req, res) => {
    res.status(404).json({msg: "no such route found!"})
})

app.use(errorMiddleware)

const port = process.env.PORT || 80

connectDB(process.env.DB_URI)
    .then(() => {
        app.listen(port, () => {
            console.log(`server is listening on port ${port}`)
        })
    })
    .catch((err) => {
        console.log(`error in connecting to server -> ${err}`)
    })