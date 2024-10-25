const mongoose = require("mongoose");

const VisaSchema = new mongoose.Schema({
  numero_visa: {
    type: String,
    required: true,
  },
  nom_depose_visa: {
    type: String,
    required: true,
  },
  prenom_depose_visa: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Visa = mongoose.model("Visas", VisaSchema);
module.exports = Visa;
