const axios = require("axios")
const dotenv = require("dotenv")

dotenv.config()

const BASE_URL = process.env.BASE_URL || "http://localhost:3001/api"
const INTERVAL = Number(process.env.INTERVAL) || 5000 // 5 seconds

const capteurs = [
  { id: "CAPTEUR001", type: "NIVEAU_EAU", min: 0, max: 100, unite: "%", lat: 48.8566, lon: 2.3522 },
  { id: "CAPTEUR002", type: "PRESSION", min: 0, max: 10, unite: "bar", lat: 45.764, lon: 4.8357 },
  { id: "CAPTEUR003", type: "DEBIT", min: 0, max: 500, unite: "L/min", lat: 43.2965, lon: 5.3698 },
]

function genererMesure(min, max) {
  return Math.random() * (max - min) + min
}

function simulerCapteur(capteur) {
  const mesure = genererMesure(capteur.min, capteur.max)

  axios
    .post(`${BASE_URL}/capteurs`, {
      idAppareil: capteur.id,
      type: capteur.type,
      localisation: {
        latitude: capteur.lat,
        longitude: capteur.lon,
      },
      derniereMesure: {
        date: new Date().toISOString(),
        valeur: Number(mesure.toFixed(2)),
        unite: capteur.unite,
      },
    })
    .then((response) => {
      console.log(`Mesure envoyée pour ${capteur.id}: ${mesure.toFixed(2)} ${capteur.unite}`)
    })
    .catch((error) => {
      console.error(`Erreur lors de l'envoi de la mesure pour ${capteur.id}:`, error.message)
    })

  // Générer une alerte si la mesure dépasse 80% de la plage
  if (mesure > (capteur.max - capteur.min) * 0.8 + capteur.min) {
    axios
      .post(`${BASE_URL}/alertes`, {
        idCapteur: capteur.id,
        type: "DEPASSEMENT_SEUIL",
        message: `Mesure élevée détectée pour ${capteur.id}: ${mesure.toFixed(2)} ${capteur.unite}`,
        niveau: "HAUTE",
      })
      .then((response) => {
        console.log(`Alerte générée pour ${capteur.id}`)
      })
      .catch((error) => {
        console.error(`Erreur lors de la génération de l'alerte pour ${capteur.id}:`, error.message)
      })
  }
}

function demarrerSimulation() {
  setInterval(() => {
    capteurs.forEach(simulerCapteur)
  }, INTERVAL)
}

console.log("Démarrage du simulateur de capteurs...")
demarrerSimulation()

