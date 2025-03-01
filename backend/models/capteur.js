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
})

module.exports = mongoose.model("Capteur", capteurSchema)

