const mongoose = require("mongoose");

const ArchiveSchema = new mongoose.Schema({
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
  numero_bordereaux: {
    type: String,
    required: true,
  },
  date_depart: {
    type: Date,
    required: true,
  },
  expiditeur: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
});

const Archive = mongoose.model("Archives", ArchiveSchema);
module.exports = Archive;
