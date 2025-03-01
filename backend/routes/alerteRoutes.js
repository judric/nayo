const express = require("express")
const router = express.Router()
const Alerte = require("../models/alerte")

// Get all alertes
router.get("/", async (req, res) => {
  try {
    const alertes = await Alerte.find()
    res.json(alertes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one alerte
router.get("/:id", getAlerte, (req, res) => {
  res.json(res.alerte)
})

// Create one alerte
router.post("/", async (req, res) => {
  const alerte = new Alerte({
    idCapteur: req.body.idCapteur,
    type: req.body.type,
    message: req.body.message,
    niveau: req.body.niveau,
    dateCreation: req.body.dateCreation,
  })

  try {
    const newAlerte = await alerte.save()
    res.status(201).json(newAlerte)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Update one alerte
router.patch("/:id", getAlerte, async (req, res) => {
  if (req.body.idCapteur != null) {
    res.alerte.idCapteur = req.body.idCapteur
  }
  if (req.body.type != null) {
    res.alerte.type = req.body.type
  }
  if (req.body.message != null) {
    res.alerte.message = req.body.message
  }
  if (req.body.niveau != null) {
    res.alerte.niveau = req.body.niveau
  }
  if (req.body.dateCreation != null) {
    res.alerte.dateCreation = req.body.dateCreation
  }

  try {
    const updatedAlerte = await res.alerte.save()
    res.json(updatedAlerte)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Delete one alerte
router.delete("/:id", getAlerte, async (req, res) => {
  try {
    await res.alerte.remove()
    res.json({ message: "Alerte supprimée" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

async function getAlerte(req, res, next) {
  let alerte
  try {
    alerte = await Alerte.findById(req.params.id)
    if (alerte == null) {
      return res.status(404).json({ message: "Alerte non trouvée" })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.alerte = alerte
  next()
}

module.exports = router

