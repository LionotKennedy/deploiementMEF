const User = require("../models/User");
const Token = require("../models/Token");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();

const { validationResult } = require("express-validator");

// ############### REGISTER #################//
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: true,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;

    const isExistUser = await User.findOne({ email });

    if (isExistUser) {
      return res.status(200).json({
        success: false,
        message: "L'e-mail existe déjà.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const userData = await user.save();

    return res.status(200).json({
      success: true,
      message: "Utilisateur ajouté avec succès.",
      data: userData,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

// ############### TOKEN #################//

const generateAccessToken = async (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
    image: user.image,
  };

  // Générez le token sans expiration (pas d'option expiresIn)
  const token = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN);

  // Enregistre le token dans la base de données
  const createdToken = await Token.create({
    userId: user._id,
    token,
  });

  console.log("Token created:", createdToken); // Ajouté pour le débogage

  return token;
};






// const generateAccessToken = async (user) => {
//   const payload = {
//     userId: user._id,
//     email: user.email,
//     role: user.role,
//     status: user.status,
//     image: user.image,
//   };

//   const token = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, {
//     expiresIn: "7d", // Le token expirera après 7 jours
//   });

//   // Enregistre le token dans la base de données
//   const createdToken = await Token.create({
//     userId: user._id,
//     token,
//   });

//   console.log("Token created:", createdToken); // Ajoutez ce log pour le débogage

//   return token;
// };

















// const generateAccessToken = async (user) => {
//   const payload = {
//     userId: user._id,
//     email: user.email,
//   };

//   const token = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, {
//     expiresIn: "48h",
//   });

//   // Save token to the database
//   const createdToken = await Token.create({
//     userId: user._id,
//     token,
//   });

//   console.log('Token created:', createdToken); // Ajoutez ce log pour le débogage

//   return token;
// };

// const generateAccessToken = async (user) => {
//   const payload = {
//     userId: user._id,
//     email: user.email,
//   };

//   const token = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN, {
//     expiresIn: "2h",
//   });

//   // Save token to the database
//   const createdToken = await Token.create({
//     userId: user._id,
//     token,
//   });

//   console.log('Token created:', createdToken); // Ajoutez ce log pour le débogage

//   return token;
// };

// const generateAccessToken = async (user) => {
//   const payload = {
//     userId: user._id,
//     email: user.email,
//     // exp: Math.floor(Date.now() / 1000) + 7200 // 2 heures en secondes
//     // exp: Math.floor(Date.now() / 1000) + 60 // 1 minute en secondes
//     exp: Math.floor(Date.now() / 1000) + 10800 // 3 heures en secondes
//   };

//   const token = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN);

//   // Sauvegarde le token avec son expiration dans la base de données
//   const createdToken = await Token.create({
//     userId: user._id,
//     token,
//     expiresAt: payload.exp
//   });

//   console.log('Token créé:', createdToken);

//   return token;
// };

// const generateAccessToken = async (user) => {
//   const payload = {
//     userId: user._id,
//     email: user.email,
//     exp: Math.floor(Date.now() / 1000) + 259200, // 3 jours en secondes
//     // exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 jours en secondes
//     // exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 jours en secondes
//   };

//   const token = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN);

//   // Sauvegarde le token avec son expiration dans la base de données
//   const createdToken = await Token.create({
//     userId: user._id,
//     token,
//     expiresAt: new Date(Date.now() + 259200000), // 3 jours à partir de maintenant
//     // expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours à partir de maintenant
//     // expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 jours à partir de maintenant
//   });

//   console.log("Token créé:", createdToken);

//   return token;
// };

// const generateAccessToken = async (user) => {
//   const payload = {
//     userId: user._id,
//     email: user.email,
//     role: user.role,
//     status: user.status,
//     image: user.image,

//     // exp: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60, // 3 jours en secondes
//     // exp: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60, // 3 jours en secondes
//     // exp: Math.floor(Date.now() / 1000) + 259200, // 3 jours en secondes
//     // exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 jours en secondes
//     // exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 jours en secondes

//     exp: Math.floor(Date.now()) + 7 * 24 * 60 * 60 // 7 jours en secondes
//   };

//   const token = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN);

//   // Sauvegarde le token avec son expiration dans la base de données
//   const createdToken = await Token.create({
//     userId: user._id,
//     token,
//     expiresAt: payload.exp,
//     // expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60),
//     // expiresAt: new Date(Date.now()),
//   });

//   console.log("Token créé:", createdToken);

//   return token;
// };

// ############### ENDING #################//

// ############### LOGIN #################//
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: true,
        message: "Errors",
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;

    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "L'e-mail est incorrect",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe est incorrect.",
      });
    }
    if (userData.status != "active") {
      return res.status(400).json({
        success: false,
        message: "Votre compte est désactivé. Veuillez contacter le support.",
      });
    }

    const accessToken = await generateAccessToken(userData);

    return res.status(200).json({
      success: true,
      message: "Connexion réussie.",
      accessToken: accessToken,
      tokenType: "Bearer",
      data: userData,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

// ############### PROFILE #################//
const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await User.findOne({ _id: id });
    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

// ############### LOGOUT #################//
const logoutUser = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Aucun token fourni",
      });
    }

    // Supprimez le token de la base de données
    await Token.deleteOne({ token });

    return res.status(200).json({
      success: true,
      message: "Déconnexion réussie.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ############### ENDING #################//

module.exports = { registerUser, loginUser, getProfile, logoutUser };
