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
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Impossible de se connecter à MongoDB", err))

// Routes
const capteurRoutes = require("./routes/capteurRoutes")
const alerteRoutes = require("./routes/alerteRoutes")

app.use("/api/capteurs", capteurRoutes)
app.use("/api/alertes", alerteRoutes)

// Socket.IO
io.on("connection", (socket) => {
  console.log("Nouveau client connecté")

  socket.on("disconnect", () => {
    console.log("Client déconnecté")
  })
})

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Une erreur est survenue !")
})

// Export io pour l'utiliser dans les routes
module.exports.io = io

const PORT = process.env.PORT || 5000

// Vérifier si le port est déjà utilisé avant de démarrer le serveur
server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`Le port ${PORT} est déjà utilisé. Veuillez choisir un port différent.`)
    process.exit(1)
  }
})

server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
})

