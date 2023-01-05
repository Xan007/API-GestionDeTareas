import mongoose from 'mongoose'
const MONGO_URL = process.env.MONGO_URL || "mongodb://0.0.0.0:27017/taskManager"

mongoose.set("strictQuery", false)
mongoose.connect(MONGO_URL)

mongoose.connection.on("connected", () => {
    console.log("Conectado a la base de datos!")
})

mongoose.connection.on("error", (err) => {
    console.log(`Error al conectar a la base de datos: ${err}`)
})
  
mongoose.connection.on("disconnected", () => {
    console.log('Desconectado de la base de datos')
})