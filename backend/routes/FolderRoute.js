const express = require("express");
const router = express.Router();

const {
  addFolderValidator,
  editFolderValidator,
  updateFolderValidator,
  deleteFolderValidator,
} = require("../helpers/ValidatorFolder");
const {
  addFolder,
  getFolder,
  editFolderById,
  updateFolderById,
  deleteFolderById,
  CountLettersByMonth,
  countLetters,
} = require("../controllers/FolderController");
const verifyToken = require("../middlewares/verifyToken");

router.post("/add_folder", verifyToken, addFolderValidator, addFolder);
router.get("/get_folder", verifyToken, getFolder);
router.get(
  "/edit_folder/:id",
  verifyToken,
  editFolderValidator,
  editFolderById
); // Nouvelle route pour récupérer un dossier par ID
router.put(
  "/update_folder/:id",
  verifyToken,
  updateFolderValidator,
  updateFolderById
); // Nouvelle route pour mettre à jour un dossier
router.delete(
  "/delete_folder/:id",
  verifyToken,
  deleteFolderValidator,
  deleteFolderById
); // Nouvelle route pour supprimer un dossier
router.get("/count_letters_by_month", verifyToken, CountLettersByMonth);
router.get("/count_letters", verifyToken, countLetters); // Ajoutez cette ligne

module.exports = router;
