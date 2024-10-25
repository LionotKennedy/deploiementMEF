
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "active",
  },
  image: {
    type: String,
    default: "uploads/uploads_default/user.png", // Chemin vers l'image par défaut
  },
  tokens: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token'
  }]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

