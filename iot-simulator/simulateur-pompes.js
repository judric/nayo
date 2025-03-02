const axios = require("axios")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config()

const BASE_URL = process.env.BASE_URL || "http://localhost:5000/api"
const INTERVAL = 5000 // 5 secondes pour des mises à jour plus fréquentes

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err))

const Capteur = require("../backend/models/capteur")

const pompes = [
  {
    id: "POMPE001",
    nom: "Pompe Bouaké",
    localisation: { latitude: 7.6906, longitude: -5.0404 },
    estNormale: true,
  },
  {
    id: "POMPE002",
    nom: "Pompe Korhogo",
    localisation: { latitude: 9.4578, longitude: -5.6294 },
    estNormale: false,
  },
]

const capteurs = [
  { type: "DEBIT", min: 0, max: 50, unite: "L/min" },
  { type: "PRESSION", min: 0, max: 10, unite: "bar" },
  { type: "NIVEAU_EAU", min: 0, max: 100, unite: "%" },
]

function genererMesure(min, max, estNormale) {
  let valeur = Math.random() * (max - min) + min
  if (!estNormale) {
    const anomalie = Math.random() * 0.3 * (max - min)
    valeur += Math.random() < 0.5 ? anomalie : -anomalie
  }
  return Math.max(min, Math.min(max, valeur))
}

async function simulerCapteur(pompe, capteur) {
  const idAppareil = `${pompe.id}_${capteur.type}`
  const mesure = genererMesure(capteur.min, capteur.max, pompe.estNormale)
  const estActif = Math.random() > 0.05

  const donneesCapteur = {
    idAppareil,
    type: capteur.type,
    localisation: pompe.localisation,
    derniereMesure: {
      date: new Date(),
      valeur: Number(mesure.toFixed(2)),
      unite: capteur.unite,
    },
    estActif,
    pompeId: pompe.id,
  }

  try {
    console.log("Envoi des données:", donneesCapteur)
    const response = await axios.post(`${BASE_URL}/capteurs`, donneesCapteur)
    console.log(`Données envoyées pour ${idAppareil}: ${mesure.toFixed(2)} ${capteur.unite}, Actif: ${estActif}`)
    console.log("Réponse du serveur:", response.data)
  } catch (error) {
    console.error(`Erreur lors de l'envoi des données pour ${idAppareil}:`, error.message)
    if (error.response) {
      console.error("Réponse du serveur:", error.response.data)
    }
  }
}

function demarrerSimulation() {
  setInterval(() => {
    pompes.forEach((pompe) => {
      capteurs.forEach((capteur) => {
        simulerCapteur(pompe, capteur)
      })
    })
  }, INTERVAL)
}

console.log("Démarrage du simulateur de pompes...")
demarrerSimulation()

