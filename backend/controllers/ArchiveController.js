const Courrier = require("../models/Courrier");
const Nature = require("../models/Nature");
const Archive = require("../models/Archive");
const Journal = require("../models/Journal");
// Import moment-timezone
const moment = require("moment-timezone");

const { validationResult } = require("express-validator");

// ############### ADD POST #################//
const addArchive = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { description, nom_depose, prenom_depose, matricule } = req.body;
    const { numero_bordereaux, date_depart, expiditeur, destination } =
      req.body;

    // Vérification de l'année de date_depart
    const currentYear = new Date().getFullYear();
    const yearOfDateDepart = new Date(date_depart).getFullYear();

    if (yearOfDateDepart < currentYear) {
      // Si la date est dans une année passée, stocker les données dans la collection Archives
      const newArchive = new Archive({
        numero_bordereaux,
        date_depart,
        expiditeur,
        destination,
        description,
        nom_depose,
        prenom_depose,
        matricule,
      });

      await newArchive.save();

      // Vérification de l'utilisateur
      if (!req.user || !req.user.name) {
        return res.status(500).json({
          success: false,
          message: "Les informations de l'utilisateur sont manquantes.",
        });
      }

      // Enregistrer l'action dans Journales
      const newJournal = new Journal({
        action: "Ajout d'un dossier archivé.",
        details: `Dossier archivé avec le numéro bordereaux: ${numero_bordereaux}`,
        user: req.user._id,
        userName: req.user.name,
        adressEmail: req.user.email,
        imageJournale: req.user.image,
        date: moment().tz("Indian/Antananarivo").toDate(), // Date au fuseau horaire de Madagascar
      });
      await newJournal.save();

      return res.status(200).json({
        success: true,
        message: "Données archivées avec succès.",
        data: newArchive,
      });
    } else {
      // Sinon, continuer à sauvegarder dans Nature et Courrier
      const newNature = new Nature({
        description,
        nom_depose,
        prenom_depose,
        matricule,
      });

      const savedNature = await newNature.save();

      const newCourrier = new Courrier({
        numero_bordereaux,
        date_depart,
        expiditeur,
        destination,
        id_nature: savedNature._id,
      });

      const savedCourrier = await newCourrier.save();

      // Enregistrer l'action dans Journales
      const newJournal = new Journal({
        action: "Ajout d'un dossier courrier",
        details: `Nouveau dossier ajouté avec le numéro bordereaux: ${numero_bordereaux}`,
        user: req.user._id,
        userName: req.user.name,
        adressEmail: req.user.email,
        imageJournale: req.user.image,
        date: moment().tz("Indian/Antananarivo").toDate(), // Date au fuseau horaire de Madagascar
      });
      await newJournal.save();

      return res.status(200).json({
        success: true,
        message: "Courrier et Nature enregistrés avec succès.",
        data: {
          nature: savedNature,
          courrier: savedCourrier,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
// ############### ENDING #################//

// ############### GET FOLDER #################//
const getArchive = async (req, res) => {
  try {
    const ArchiveData = await Archive.find();
    return res.status(200).json({
      success: true,
      message: "Archive récupérée avec succès.",
      data: ArchiveData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
// ############### ENDING #################//

// ############### EDIT ARCHIVE BY ID #################//
const editArchiveById = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête

    // Rechercher un seul courrier par son ID et inclure les informations de la nature associée
    const archive = await Archive.findOne({ _id: id });

    if (!archive) {
      return res.status(404).json({
        success: false,
        message: "Dossier non trouvé",
      });
    }

    const ArchiveData = {
      description: archive.description,
      nom_depose: archive.nom_depose,
      prenom_depose: archive.prenom_depose,
      matricule: archive.matricule,
      numero_bordereaux: archive.numero_bordereaux,
      date_depart: archive.date_depart,
      expiditeur: archive.expiditeur,
      destination: archive.destination,
      id: archive._id,
    };

    return res.status(200).json({
      success: true,
      message: "Archive récupérée avec succès.",
      data: ArchiveData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
// ############### ENDING #################//

// ############### UPDATE ARCHIVE BY ID #################//
const updateArchiveById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      description,
      nom_depose,
      prenom_depose,
      matricule,
      numero_bordereaux,
      date_depart,
      expiditeur,
      destination,
    } = req.body;

    const currentYear = new Date().getFullYear();
    const yearOfDateDepart = new Date(date_depart).getFullYear();

    if (yearOfDateDepart < currentYear) {
      // Si la date est inférieure à l'année en cours, mettre à jour dans Archives
      const archive = await Archive.findOneAndUpdate(
        { _id: id },
        {
          numero_bordereaux,
          date_depart,
          expiditeur,
          destination,
          description,
          nom_depose,
          prenom_depose,
          matricule,
        },
        { new: true, upsert: true }
      );

      if (!archive) {
        return res.status(404).json({
          success: false,
          message: "Archive non trouvée",
        });
      }

      const newJournal = new Journal({
        action: `Mise à jour de dossier archivé`,
        details: `Dossier mis à jour avec le numéro bordereaux: ${archive.numero_bordereaux}`,
        user: req.user._id,
        userName: req.user.name,
        adressEmail: req.user.email,
        imageJournale: req.user.image,
      });
      await newJournal.save();

      return res.status(200).json({
        success: true,
        message: "Données archivées avec succès.",
        data: archive,
      });
    } else {
      // Si la date est >= année en cours, sauvegarder dans Courriers et Natures
      const nature = await Nature.findOneAndUpdate(
        { _id: id }, // Si tu veux mettre à jour une entrée existante dans Nature
        {
          description,
          nom_depose,
          prenom_depose,
          matricule,
        },
        { new: true, upsert: true } // Met à jour ou crée un nouvel enregistrement si non trouvé
      );

      const courrier = await Courrier.findOneAndUpdate(
        { id_nature: nature._id }, // Recherche par la référence de Nature
        {
          numero_bordereaux,
          date_depart,
          expiditeur,
          destination,
        },
        { new: true, upsert: true }
      );

      // Supprimer l'ancienne entrée dans Archives si elle existe
      await Archive.findByIdAndDelete(id);

      const newJournal = new Journal({
        action: "Mise à jour de dossier courrier",
        details: `Dossier mis à jour avec le numéro bordereaux: ${numero_bordereaux}`,
        user: req.user._id,
        userName: req.user.name,
        adressEmail: req.user.email,
        imageJournale: req.user.image,
      });
      await newJournal.save();

      return res.status(200).json({
        success: true,
        message: "Dossier mis à jour avec succès.",
        data: {
          nature,
          courrier,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
// ############### ENDING #################//

// ############### ARCHIVE DELETING #################//
const deleteArhiveById = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête
    const archive = await Archive.findById(id);
    await archive.deleteOne({ $set: req.body });
    const newJournal = new Journal({
      action: "Suppression de dossier archivé",
      details: `Dossier supprimé avec le numéro bordereaux: ${archive.numero_bordereaux}`,
      user: req.user._id,
      userName: req.user.name,
      adressEmail: req.user.email,
      imageJournale: req.user.image,
    });
    await newJournal.save();
    res.status(200).json({
      status: 200,
      message: "Archive supprimée avec succès.",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// ################# ENDING ####################//

// ################# GET DATA BY YEAR ####################//
const getArchiveByYear = async (req, res) => {
  try {
    const { year } = req.params; // Récupérer l'année à partir des paramètres de l'URL

    // Vérifier si l'année est un nombre valide
    if (!year || isNaN(year)) {
      return res.status(400).json({
        success: false,
        message: "Paramètre d'année invalide.",
      });
    }

    // Rechercher les archives pour une année spécifique avec tri par numero_bordereaux en ordre croissant
    const archives = await Archive.aggregate([
      {
        $match: {
          date_depart: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${parseInt(year) + 1}-01-01`), // Obtenir toutes les dates dans l'année donnée
          },
        },
      },
      {
        $addFields: {
          numero_bordereaux_num: { $toInt: "$numero_bordereaux" } // Conversion de numero_bordereaux en nombre pour tri
        }
      },
      {
        $sort: { numero_bordereaux_num: 1 } // Tri en ordre croissant
      }
    ]);

    if (archives.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Aucune archive trouvée pour l'année ${year}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Archives récupérées pour l'année ${year}`,
      data: archives,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur du serveur : " + error.message,
    });
  }
};
// ################# ENDING ####################//

// ################# GET DATAGROUP BY YEAR ####################//
const getArchiveGroupedByYear = async (req, res) => {
  try {
    const archives = await Archive.aggregate([
      {
        $group: {
          _id: { $year: "$date_depart" }, // Grouper par année de la date_depart
          archives: { $push: "$$ROOT" }, // Ajouter toutes les archives de cette année
        },
      },
      {
        $sort: { _id: 1 }, // Trier par année croissante
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Archives regroupées par année.",
      data: archives,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// ################# ENDING ####################//

module.exports = {
  addArchive,
  getArchive,
  editArchiveById,
  updateArchiveById,
  deleteArhiveById,
  getArchiveByYear,
  getArchiveGroupedByYear,
};
