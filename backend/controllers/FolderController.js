const Courrier = require("../models/Courrier");
const Nature = require("../models/Nature");
const Archive = require("../models/Archive");
const Journal = require("../models/Journal");

const { validationResult } = require("express-validator");

// ############### ADD FOLDER #################//
const addFolder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Erreurs de validation",
        errors: errors.array(),
      });
    }

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

    // Vérification de l'existence du numéro de bordereaux
    const existingCourrier = await Courrier.findOne({
      numero_bordereaux: numero_bordereaux,
    });

    if (existingCourrier) {
      // Si le numéro de bordereaux existe déjà, retourner une erreur
      return res.status(409).json({
        success: false,
        message: "Le numéro de bordereaux existe déjà",
      });
    }

    // Vérification de l'année
    const currentYear = new Date().getFullYear();
    const yearOfDateDepart = new Date(date_depart).getFullYear();

    if (yearOfDateDepart < currentYear) {
      // Si la date est dans une année passée, archiver dans 'Archive'
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

      // Enregistrer dans Journal
      const newJournal = new Journal({
        action: "Ajout d'un dossier archivé",
        details: `Dossier archivé avec le numéro bordereaux: ${numero_bordereaux}`,
        user: req.user._id,
        userName: req.user.name,
        adressEmail: req.user.email,
        imageJournale: req.user.image,
      });
      await newJournal.save();

      return res.status(200).json({
        success: true,
        message: "Données archivées avec succès",
        data: newArchive,
        user: req.user.name,
      });
    } else {
      // Sauvegarder dans 'Nature' et 'Courrier'
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

      // Enregistrer dans Journal
      const newJournal = new Journal({
        action: "Ajout d'un nouveau dossier courrier",
        details: `Nouveau dossier ajouté avec le numéro bordereaux: ${numero_bordereaux}`,
        user: req.user._id,
        userName: req.user.name,
        adressEmail: req.user.email,
        imageJournale: req.user.image,
      });
      await newJournal.save();

      return res.status(200).json({
        success: true,
        message: "Courrier et Nature enregistrés avec succès",
        data: {
          nature: savedNature,
          courrier: savedCourrier,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Erreur serveur: " + error.message,
    });
  }
};

// ############### ENDING #################//

// ############### GET FOLDER #################//
const getFolder = async (req, res) => {
  try {
    // Utiliser l'agrégation pour trier en convertissant 'numero_bordereaux' en nombre
    const courriers = await Courrier.aggregate([
      {
        $addFields: {
          numero_bordereaux_num: { $toInt: "$numero_bordereaux" } // Conversion en nombre
        }
      },
      {
        $sort: { numero_bordereaux_num: 1 } // Tri sur la version numérique
      },
      {
        $lookup: {
          from: "natures", // Nom de la collection 'Natures'
          localField: "id_nature",
          foreignField: "_id",
          as: "id_nature"
        }
      },
      {
        $unwind: "$id_nature" // Pour décomposer l'array retourné par le lookup
      }
    ]);

    if (!courriers || courriers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Aucun dossier trouvé.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dossiers récupérés avec succès.",
      data: courriers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
// ############### ENDING #################//


// ############### EDIT FOLDER BY ID #################//
const editFolderById = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête

    // Rechercher un seul courrier par son ID et inclure les informations de la nature associée
    const courrier = await Courrier.findById(id).populate("id_nature");

    if (!courrier) {
      return res.status(404).json({
        success: false,
        message: "Dossier non trouvé.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dossier récupéré avec succès.",
      data: courrier,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
// ############### ENDING #################//

// ############### UPDATE FOLDER BY ID #################//
const updateFolderById = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID du courrier depuis les paramètres de la requête
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

    // Vérification de l'existence du numéro de bordereaux
    const existingCourrier = await Courrier.findOne({
      numero_bordereaux: numero_bordereaux,
    });

    if (existingCourrier && existingCourrier._id.toString() !== id) {
      return res.status(409).json({
        success: false,
        message: "Le numéro de bordereaux existe déjà",
      });
    }

    // Étape 1 : Rechercher le courrier par son ID
    const courrier = await Courrier.findById(id);
    if (!courrier) {
      return res.status(404).json({
        success: false,
        message: "Dossier non trouvé.",
      });
    }

    // Étape 2 : Rechercher la nature associée par l'ID du courrier
    const nature = await Nature.findById(courrier.id_nature);
    if (!nature) {
      return res.status(404).json({
        success: false,
        message: "Nature non trouvée.",
      });
    }

    // Étape 3 : Vérifier l'année de la nouvelle date_depart
    const yearOfDateDepart = new Date(date_depart).getFullYear();
    const currentYear = new Date().getFullYear();

    if (yearOfDateDepart < currentYear) {
      // Si la date est dans une année passée, archiver les données
      const newArchive = new Archive({
        numero_bordereaux: numero_bordereaux || courrier.numero_bordereaux,
        date_depart: date_depart || courrier.date_depart,
        expiditeur: expiditeur || courrier.expiditeur,
        destination: destination || courrier.destination,
        description: description || nature.description,
        nom_depose: nom_depose || nature.nom_depose,
        prenom_depose: prenom_depose || nature.prenom_depose,
        matricule: matricule || nature.matricule,
      });

      await newArchive.save();

      // Supprimer les documents des collections nature et courrier
      await Courrier.findByIdAndDelete(courrier._id);
      await Nature.findByIdAndDelete(nature._id);

      // Vérification de l'utilisateur
      if (!req.user || !req.user.name) {
        return res.status(500).json({
          success: false,
          message: "Les informations de l'utilisateur sont manquantes.",
        });
      }

      const newJournal = new Journal({
        action: "Archivage de dossier",
        details: `Dossier archivé avec le numéro bordereaux: ${numero_bordereaux}`,
        user: req.user._id,
        userName: req.user.name,
        adressEmail: req.user.email,
        imageJournale: req.user.image,
      });
      await newJournal.save();

      return res.status(200).json({
        success: true,
        message: "Données archivées avec succès.",
        data: newArchive,
      });
    } else {
      // Sinon, mettre à jour les champs dans la collection Natures
      nature.description = description || nature.description;
      nature.nom_depose = nom_depose || nature.nom_depose;
      nature.prenom_depose = prenom_depose || nature.prenom_depose;
      nature.matricule = matricule || nature.matricule;
      await nature.save(); // Sauvegarder les modifications dans la collection Natures

      // Mettre à jour les champs dans la collection Courriers
      courrier.numero_bordereaux =
        numero_bordereaux || courrier.numero_bordereaux;
      courrier.date_depart = date_depart || courrier.date_depart;
      courrier.expiditeur = expiditeur || courrier.expiditeur;
      courrier.destination = destination || courrier.destination;
      await courrier.save(); // Sauvegarder les modifications dans la collection Courriers

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

// ############### DELETE FOLDER BY ID #################//
const deleteFolderById = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID du courrier depuis les paramètres de la requête

    // Étape 1 : Rechercher le courrier par son ID
    const courrier = await Courrier.findById(id);
    if (!courrier) {
      return res.status(404).json({
        success: false,
        message: "Dossier non trouvé.",
      });
    }

    // Étape 2 : Supprimer la nature associée
    const nature = await Nature.findByIdAndDelete(courrier.id_nature);
    if (!nature) {
      return res.status(404).json({
        success: false,
        message: "Nature associée à ce dossier non trouvée.",
      });
    }

    // Étape 3 : Supprimer le courrier
    await Courrier.findByIdAndDelete(id);

    const newJournal = new Journal({
      action: "Suppression de dossier courrier",
      details: `Dossier supprimé avec le numéro bordereaux: ${courrier.numero_bordereaux}`,
      user: req.user._id,
      userName: req.user.name,
      adressEmail: req.user.email,
      imageJournale: req.user.image,
    });
    await newJournal.save();

    return res.status(200).json({
      success: true,
      message: "Dossier et Nature associés supprimés avec succès.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
// ############### ENDING #################//

// ############### COUNT LETTER BY MONTH #################//

const CountLettersByMonth = async (req, res) => {
  try {
    // Récupérer l'année actuelle
    const currentYear = new Date().getFullYear();

    // Créer des bornes de date pour l'année spécifiée
    const startDate = new Date(`${currentYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${currentYear + 1}-01-01T00:00:00.000Z`);

    // Pipeline d'agrégation pour grouper les courriers par mois et les compter
    const courrierByMonth = await Courrier.aggregate([
      {
        // Filtrer les courriers de l'année en cours
        $match: {
          date_depart: {
            $gte: startDate, // Date de début de l'année
            $lt: endDate, // Date de fin de l'année
          },
        },
      },
      {
        // Extraire le mois à partir de la date
        $project: {
          month: { $month: "$date_depart" },
        },
      },
      {
        // Grouper par mois et compter
        $group: {
          _id: "$month",
          count: { $sum: 1 },
        },
      },
      {
        // Trier par mois
        $sort: { _id: 1 },
      },
    ]);

    // Tableau pour convertir les numéros de mois en noms de mois
    const monthNames = [
      "",
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    // Remplacer les ID des mois par leurs noms dans la réponse
    const courrierByMonthWithNames = courrierByMonth.map((item) => ({
      month: monthNames[item._id],
      count: item.count,
    }));

    // Vérifier si des résultats existent
    if (courrierByMonth.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Aucun courrier trouvé pour l'année ${currentYear}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Nombre récupéré avec succès.",
      data: {
        year: currentYear,
        courrierByMonth: courrierByMonthWithNames, // Le nombre de courriers pour chaque mois avec noms
      },
    });
  } catch (error) {
    console.error("Error counting letters:", error);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

// ############### ENDING #################//

// ############### COUNT LETTERS #################//
const countLetters = async (req, res) => {
  try {
    // Compte le nombre de courriers dans la collection
    const count = await Courrier.countDocuments();

    return res.status(200).json({
      success: true,
      message: "Nombre de lettres comptées avec succès.",
      count: count,
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
  addFolder,
  getFolder,
  editFolderById,
  updateFolderById,
  deleteFolderById,
  CountLettersByMonth,
  countLetters,
};
