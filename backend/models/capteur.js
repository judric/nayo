const mongoose = require("mongoose")

const capteurSchema = new mongoose.Schema({
  idAppareil: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["DEBIT", "PRESSION", "NIVEAU_EAU"],
  },
  localisation: {
    latitude: Number,
    longitude: Number,
  },
  derniereMesure: {
    date: {
      type: Date,
      default: Date.now,
    },
    valeur: Number,
    unite: String,
  },
  estActif: {
    type: Boolean,
    default: true,
  },
  pompeId: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("Capteur", capteurSchema)

