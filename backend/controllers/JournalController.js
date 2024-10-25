const Journal = require("../models/Journal");

// ############### GET FOLDER #################//
const getJournal = async (req, res) => {
  try {
    const JournalData = await Journal.find();
    return res.status(200).json({
      success: true,
      message: "Archive récupérée avec succès.",
      data: JournalData,
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
const editJournalById = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête

    // Rechercher un seul courrier par son ID et inclure les informations de la nature associée
    const journal = await Journal.findOne({ _id: id });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Dossier non trouvé.",
      });
    }

    const journalData = {
      action: journal.action,
      date: journal.date,
      details: journal.details,
      createdAt: journal.createdAt,
      updatedAt: journal.updatedAt,
      userName: journal.userName,
      adressEmail: journal.adressEmail,
      imageJournale: journal.imageJournale,
      id: journal._id,
    };

    return res.status(200).json({
      success: true,
      message: "Archive récupérée avec succès.",
      data: journalData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
// ############### ENDING #################//

// ############### ARCHIVE DELETING #################//
const deleteJournalById = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête
    const journal = await Journal.findById(id);
    await journal.deleteOne({ $set: req.body });
    res.status(200).json({
      status: 200,
      message: "Journal supprimé avec succès.",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
// ################# ENDING ####################//

module.exports = { getJournal, editJournalById, deleteJournalById };
