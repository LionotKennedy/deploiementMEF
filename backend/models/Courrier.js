const mongoose = require("mongoose");

const CourrierSchema = new mongoose.Schema({
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
  id_nature: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Natures",
  },
});

const Courrier = mongoose.model("Courriers", CourrierSchema);
module.exports = Courrier;
