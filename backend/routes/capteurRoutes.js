const express = require("express")
const router = express.Router()
const Capteur = require("../models/capteur")
const { io } = require("../app")

// Obtenir tous les capteurs
router.get("/", async (req, res, next) => {
  try {
    const capteurs = await Capteur.find()
    res.json(capteurs)
  } catch (err) {
    next(err)
  }
})

// Obtenir un capteur spécifique
router.get("/:id", async (req, res, next) => {
  try {
    const capteur = await Capteur.findById(req.params.id)
    if (!capteur) {
      return res.status(404).json({ message: "Capteur non trouvé" })
    }
    res.json(capteur)
  } catch (err) {
    next(err)
  }
})

// Obtenir les capteurs par pompe
router.get("/pompe/:pompeId", async (req, res, next) => {
  try {
    const capteurs = await Capteur.find({ pompeId: req.params.pompeId })
    res.json(capteurs)
  } catch (err) {
    next(err)
  }
})

// Créer ou mettre à jour un capteur
router.post("/", async (req, res, next) => {
  try {
    const { idAppareil, type, localisation, derniereMesure, estActif, pompeId } = req.body

    if (!pompeId) {
      return res.status(400).json({ message: "Le champ 'pompeId' est requis." })
    }

    console.log("Données reçues:", req.body)

    const capteur = await Capteur.findOneAndUpdate(
      { idAppareil },
      { idAppareil, type, localisation, derniereMesure, estActif, pompeId },
      { upsert: true, new: true, runValidators: true },
    )

    io.emit("capteurUpdate", capteur)
    res.status(201).json(capteur)
  } catch (err) {
    console.error("Erreur lors de la création/mise à jour du capteur:", err)
    next(err)
  }
})

// Mettre à jour un capteur spécifique
router.patch("/:id", async (req, res, next) => {
  try {
    const capteur = await Capteur.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!capteur) {
      return res.status(404).json({ message: "Capteur non trouvé" })
    }
    io.emit("capteurUpdate", capteur)
    res.json(capteur)
  } catch (err) {
    next(err)
  }
})

// Supprimer un capteur
router.delete("/:id", async (req, res, next) => {
  try {
    const capteur = await Capteur.findByIdAndDelete(req.params.id)
    if (!capteur) {
      return res.status(404).json({ message: "Capteur non trouvé" })
    }
    io.emit("capteurDelete", req.params.id)
    res.json({ message: "Capteur supprimé" })
  } catch (err) {
    next(err)
  }
})

// Middleware de gestion des erreurs
router.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Une erreur est survenue sur le serveur", error: err.message })
})

module.exports = router

