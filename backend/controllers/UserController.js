const User = require("../models/User");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const sendMail = require("../utils/sendMail"); // Assure-toi que ce fichier est bien en place
const dns = require("dns"); // Importer le module dns pour vérifier la connexion

const { validationResult } = require("express-validator");

// ############### TESTE CONNEXION #################//
// Fonction pour vérifier la connexion Internet
const checkInternetConnection = () => {
  return new Promise((resolve, reject) => {
    dns.lookup("google.com", (err) => {
      if (err && err.code === "ENOTFOUND") {
        reject(new Error("Aucune connexion Internet."));
      } else {
        resolve(true);
      }
    });
  });
};
// ############### ENDING #################//

// ############### CREATE USER #################//
const createUsers = async (req, res) => {
  // console.log("coucou li user");
  try {
    // Vérifier la connexion Internet
    await checkInternetConnection();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { name, email } = req.body;

    const isExists = await User.findOne({ email });
    if (isExists) {
      return res.status(400).json({
        success: false,
        message: "L'e-mail existe déjà.",
      });
    }

    const password = randomstring.generate(6);
    const hashPassword = await bcrypt.hash(password, 10);

    let imagePath = "uploads_default/user.png";

    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const obj = {
      name,
      email,
      password: hashPassword,
      image: imagePath,
    };

    if (req.body.role && req.body.role == 1) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas créer un administrateur.",
      });
    } else if (req.body.role) {
      obj.role = req.body.role;
    }

    const user = new User(obj);
    const userData = await user.save();

    const content = `
      <p>Bonjour <b>${userData.name}</b>, Votre compte a été créé. Voici vos détails.</p>
      <table style="border-style:none;">
        <tr>
          <th>Nom: -</th>
          <td>${userData.name}</td>
        </tr>
        <tr>
          <th>E-mail: -</th>
          <td>${userData.email}</td>
        </tr>
        <tr>
          <th>Mot de passe: -</th>
          <td>${password}</td>
        </tr>
      </table>
      <p>Vous pouvez maintenant vous connecter à votre compte. Merci...</p>
    `;
    sendMail(userData.email, "Compte créé", content);

    return res.status(200).json({
      success: true,
      message: "Utilisateur créé avec succès.",
      data: userData,
    });
  } catch (error) {
    // Vérifie si l'erreur est liée à l'absence de connexion
    if (error.message === "Aucune connexion Internet.") {
      return res.status(400).json({
        success: false,
        message: "Aucune connexion Internet. Veuillez réessayer plus tard.",
      });
    }
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

// ############### GET USERS #################//
const getUsers = async (req, res) => {
  try {
    const userData = await User.find();
    return res.status(200).json({
      success: true,
      message: "Utilisateur récupéré avec succès.",
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

// ############### EDIT USERS #################//
const editUsers = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête

    // Rechercher un seul utilisateur par son ID
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé...",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    console.log("Image récupérée :", user.image);

    let imageUrl;
    let message;

    if (user.image && user.image.startsWith("/uploads")) {
      // Si l'image commence par "/uploads", c'est une image personnalisée
      imageUrl = `${baseUrl}${user.image}`;
      message = "personnaliser";
      console.log(message);
    } else if (user.image && user.image.startsWith("uploads_default/")) {
      // Si l'image commence par "uploads_default/", c'est une image par défaut
      imageUrl = `${baseUrl}/uploads/${user.image}`;
      message = "par default";
      console.log(message);
    } else {
      // Si aucune image n'est trouvée ou si le chemin n'est pas reconnu, utiliser l'image par défaut
      imageUrl = `${baseUrl}/uploads/uploads_default/user.png`;
      message = "par default";
    }

    // console.log(`Message pour l'image : ${message}`);
    // console.log("URL générée pour l'image :", imageUrl);

    const userData = {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      status: user.status,
      image: imageUrl,
      id: user._id,
    };

    return res.status(200).json({
      success: true,
      message: "Utilisateur récupéré avec succès.",
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

// ############### UPDATE USERS #################//
const updateUsers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: true,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { name, email } = req.body;
    let imagePath = req.file ? `/uploads/${req.file.filename}` : null; // Chemin de l'image

    const userExists = await User.findById(id);
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "L'utilisateur n'existe pas.",
      });
    }

    const updateObj = { name, email };

    // Si une nouvelle image est fournie
    if (imagePath) {
      updateObj.image = imagePath;

      // Supprimer l'ancienne image si elle existe
      if (
        userExists.image &&
        userExists.image !== "uploads/uploads_default/user.png"
      ) {
        const oldImagePath = path.join(
          __dirname,
          "../uploads",
          path.basename(userExists.image)
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Échec de la suppression de l'ancienne image:", err);
          }
        });
      }
    }

    if (req.body.role !== undefined) {
      updateObj.role = req.body.role;
    }

    if (req.body.status !== undefined) {
      updateObj.status = req.body.status;
    }

    if (req.body.image !== undefined) {
      updateObj.image = req.body.image;
    }

    const updatedUser = await User.updateOne({ _id: id }, { $set: updateObj });

    if (updatedUser.modifiedCount === 1) {
      return res.status(200).json({
        success: true,
        message: "Utilisateur mis à jour avec succès.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Échec de la mise à jour de l'utilisateur.",
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

// ############### DELETE USERS #################//
const deleteUsers = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: false,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    const userToDelete = await User.findById(id);

    if (!userToDelete) {
      return res.status(400).json({
        success: false,
        message: "Utilisateur non trouvé.",
      });
    }

    // Check if user has an image
    if (
      userToDelete.image &&
      userToDelete.image !== "uploads_default/user.png"
    ) {
      const imagePath = path.join(
        __dirname,
        "../uploads",
        path.basename(userToDelete.image)
      );
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image:", err);
        }
      });
    }

    const deletedUser = await User.findByIdAndDelete({ _id: id });

    if (deletedUser) {
      return res.status(200).json({
        success: true,
        message:
          "Suppression réussie : L'utilisateur a été supprimé avec succès",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Échec de la suppression de l'utilisateur",
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

// ############### UPDATE ROLE AND STATUS #################//
const UpdateRoleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    if (!role || !status) {
      return res.status(400).json({
        success: false,
        message: "Le champ 'role' et 'status' sont requis.",
      });
    }

    const userToUpdate = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { role, status } },
      { new: true }
    );

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message: "L'utilisateur n'a pas été trouvé.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rôle et statut de l'utilisateur mis à jour avec succès.",
      data: userToUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Une erreur s'est produite lors de la mise à jour de l'utilisateur.",
      error: error.message,
    });
  }
};
// ############### ENDING #################//

// ############### UPDATE PASSWORD USERS #################//
const UpdatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Les champs 'ancien mot de passe' et 'nouveau mot de passe' sont requis.",
      });
    }

    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        message: "L'utilisateur n'a pas été trouvé.",
      });
    }

    // Vérification du mot de passe actuel
    const isValidPassword = await bcrypt.compare(
      oldPassword,
      userToUpdate.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe actuel incorrect.",
      });
    }

    // Mise à jour du mot de passe si la vérification est réussie
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { $set: { password: hashedNewPassword } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du mot de passe.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Mot de passe mis à jour avec succès.",
      data: updatedUser,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du mot de passe:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message:
        "Une erreur s'est produite lors de la mise à jour du mot de passe.",
      error: error.message,
    });
  }
};

// ############### ENDING #################//

// ############### UPDATE USERS #################//
const updateUsersEmailName = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: true,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { name, email } = req.body;

    const userExists = await User.findById(id);
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "L'utilisateur n'existe pas",
      });
    }

    const updateObj = { name, email };

    const updatedUser = await User.updateOne({ _id: id }, { $set: updateObj });

    if (updatedUser.modifiedCount === 1) {
      return res.status(200).json({
        success: true,
        message: "L'utilisateur a été mis à jour avec succès",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Échec de la mise à jour de l'utilisateur",
      });
    }
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

module.exports = {
  getUsers,
  editUsers,
  updateUsers,
  deleteUsers,
  createUsers,
  UpdateRoleStatus,
  UpdatePassword,
  updateUsersEmailName,
};
