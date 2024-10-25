const express = require("express");
const router = express.Router();

const {
  editFolderValidator,
  deleteFolderValidator,
} = require("../helpers/ValidatorFolder");
const {
  getJournal,
  editJournalById,
  deleteJournalById,
} = require("../controllers/JournalController");

router.get("/get_journal", getJournal);
router.get("/edit_journal/:id", editFolderValidator, editJournalById); // Nouvelle route pour récupérer un dossier par ID
router.delete("/delete_journal/:id", deleteFolderValidator, deleteJournalById); // Nouvelle route pour supprimer un dossier

module.exports = router;
