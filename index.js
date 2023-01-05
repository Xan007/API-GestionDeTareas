import express from "express"
import dotenv from "dotenv"
import router from "./routes/index.js"
dotenv.config()

import "./db.js"
import "./initialSetup.js"

const app = express()
app.use(express.json())

app.use("/", router)

app.listen(process.env.PORT, () => {
    console.log(`App listening on: http://localhost:${process.env.PORT}`)
})