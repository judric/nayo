const express = require("express")
const router = express.Router()
const Capteur = require("../models/capteur")
const { io } = require("../app")

// Get all capteurs
router.get("/", async (req, res) => {
  try {
    const capteurs = await Capteur.find()
    res.json(capteurs)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one capteur
router.get("/:id", getCapteur, (req, res) => {
  res.json(res.capteur)
})

// Create one capteur
router.post("/", async (req, res) => {
  const capteur = new Capteur({
    idAppareil: req.body.idAppareil,
    type: req.body.type,
    localisation: req.body.localisation,
    derniereMesure: req.body.derniereMesure,
  })

  try {
    const newCapteur = await capteur.save()
    io.emit("capteurUpdate", newCapteur)
    res.status(201).json(newCapteur)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update one capteur
router.patch("/:id", getCapteur, async (req, res) => {
  if (req.body.idAppareil != null) {
    res.capteur.idAppareil = req.body.idAppareil
  }
  if (req.body.type != null) {
    res.capteur.type = req.body.type
  }
  if (req.body.localisation != null) {
    res.capteur.localisation = req.body.localisation
  }
  if (req.body.derniereMesure != null) {
    res.capteur.derniereMesure = req.body.derniereMesure
  }

  try {
    const updatedCapteur = await res.capteur.save()
    io.emit("capteurUpdate", updatedCapteur)
    res.json(updatedCapteur)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete one capteur
router.delete("/:id", getCapteur, async (req, res) => {
  try {
    await res.capteur.remove()
    io.emit("capteurDelete", res.capteur.id)
    res.json({ message: "Capteur supprimé" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getCapteur(req, res, next) {
  let capteur
  try {
    capteur = await Capteur.findById(req.params.id)
    if (capteur == null) {
      return res.status(404).json({ message: "Capteur non trouvé" })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.capteur = capteur
  next()
}

module.exports = router

