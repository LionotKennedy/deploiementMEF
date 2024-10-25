const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");
const bcrypt = require("bcrypt");
const dns = require("dns"); // Ajout de ce module pour vérifier la connexion Internet

// ############### TESTE CONNEXION #################//
// Fonction pour vérifier la connexion Internet
const checkInternetConnection = () => {
  return new Promise((resolve, reject) => {
    dns.lookup("google.com", (err) => {
      if (err) {
        reject(new Error("Aucune connexion Internet."));
      } else {
        resolve(true);
      }
    });
  });
};
// ############### ENDING #################//

// ############### REQUEST PASSWORD RESET #################//
// Fonction pour demander la réinitialisation du mot de passe
const requestPasswordReset = async (req, res) => {
  try {
    // Vérification de la connexion Internet
    await checkInternetConnection();

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Un utilisateur avec cet e-mail n'existe pas.",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    const token = new Token({
      userId: user._id,
      token: resetToken,
      createdAt: Date.now(),
    });

    await token.save();

    const content = `
    <p>Bonjour ${user.name},</p>
    <p>Vous avez demandé à réinitialiser votre mot de passe. Utilisez le code suivant pour le réinitialiser :</p>
    <h3>${resetToken}</h3>
    <p>Si vous n'avez pas fait cette demande, veuillez ignorer cet e-mail.</p>
    `;

    await sendMail(user.email, "Réinitialisation du Mot de Passe", content);

    return res.status(200).json({
      success: true,
      message: "Code de vérification envoyé à votre e-mail.",
    });
  } catch (error) {
    // Si la connexion Internet échoue
    if (error.message === "Aucune connexion Internet.") {
      return res.status(503).json({
        success: false,
        message: "Aucune connexion Internet. Veuillez réessayer plus tard.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

// ############### CHANGE PASSWORD #################//
// Fonction pour réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  try {
    // Vérification de la connexion Internet
    await checkInternetConnection();

    const { token, newPassword } = req.body;

    const passwordResetToken = await Token.findOne({ token });

    if (!passwordResetToken) {
      return res.status(400).json({
        success: false,
        message: "Token invalide ou expiré.",
      });
    }

    const isExpired = Date.now() - passwordResetToken.createdAt > 3600000;
    if (isExpired) {
      return res.status(400).json({
        success: false,
        message: "Le token a expiré.",
      });
    }

    const user = await User.findById(passwordResetToken.userId);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await Token.findByIdAndDelete(passwordResetToken._id);

    return res.status(200).json({
      success: true,
      message: "Mot de passe réinitialisé avec succès.",
    });
  } catch (error) {
    // Si la connexion Internet échoue
    if (error.message === "Aucune connexion Internet.") {
      return res.status(503).json({
        success: false,
        message: "Aucune connexion Internet. Veuillez réessayer plus tard.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

module.exports = { requestPasswordReset, resetPassword };
