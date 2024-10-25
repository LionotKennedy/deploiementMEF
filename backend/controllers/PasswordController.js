// PasswordController.js
const crypto = require("crypto");
const User = require("../models/User");
const { sendSms } = require("../services/smsService");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

// Fonction pour normaliser les numéros de téléphone
const normalizePhoneNumber = (phone) => {
  // Retirer les espaces, tirets, et autres caractères indésirables
  phone = phone.replace(/\s+/g, "").replace(/-/g, "");

  // Si le numéro commence par '0', remplacez-le par +261 (indicatif pour Madagascar)
  if (phone.startsWith("0")) {
    phone = `+261${phone.substring(1)}`;
  }

  return phone;
};

// Demander la réinitialisation du mot de passe
const requestPasswordReset = async (req, res) => {
  try {
    let { phone } = req.body;

    // Normaliser le numéro de téléphone
    phone = normalizePhoneNumber(phone);

    // Rechercher l'utilisateur avec le numéro de téléphone normalisé
    const user = await User.findOne({ phone });
    console.log(user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Aucun utilisateur trouvé avec ce numéro de téléphone.",
      });
    }

    // Générer un token de réinitialisation et définir une expiration
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
    await user.save();

    // Envoyer un SMS avec les instructions pour réinitialiser le mot de passe
    const resetUrl = `${process.env.BASE_URL}/reset/${token}`;
    const message = `Vous recevez ce message parce que vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe. Veuillez effectuer une requête PUT à l'adresse suivante dans l'heure qui suit pour réinitialiser votre mot de passe: ${resetUrl}`;

    await sendSms(phone, message);

    return res.status(200).json({
      success: true,
      message:
        "Instructions de réinitialisation du mot de passe envoyées par SMS.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Le token de réinitialisation du mot de passe est invalide ou a expiré.",
      });
    }

    // Mettre à jour le mot de passe et réinitialiser les champs de réinitialisation
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Le mot de passe a été mis à jour avec succès.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { requestPasswordReset, resetPassword };
