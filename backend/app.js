const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const http = require("http")
const socketIo = require("socket.io")

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err))

// Routes
const capteurRoutes = require("./routes/capteurRoutes")
const alerteRoutes = require("./routes/alerteRoutes")

app.use("/api/capteurs", capteurRoutes)
app.use("/api/alertes", alerteRoutes)

// Socket.IO
io.on("connection", (socket) => {
  console.log("New client connected")

  socket.on("disconnect", () => {
    console.log("Client disconnected")
  })
})

// Export io to use in routes
module.exports.io = io

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

