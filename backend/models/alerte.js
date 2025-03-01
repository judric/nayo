const mongoose = require("mongoose")

const alerteSchema = new mongoose.Schema({
  idCapteur: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  niveau: {
    type: String,
    enum: ["BASSE", "MOYENNE", "HAUTE", "CRITIQUE"],
    required: true,
  },
  dateCreation: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Alerte", alerteSchema)

