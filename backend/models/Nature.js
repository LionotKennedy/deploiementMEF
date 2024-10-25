const mongoose = require("mongoose");

const NatureSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  nom_depose: {
    type: String,
    required: true,
  },
  prenom_depose: {
    type: String,
    required: true,
  },
  matricule: {
    type: String,
    required: true,
  },
});

const Nature = mongoose.model("Natures", NatureSchema);
module.exports = Nature;
