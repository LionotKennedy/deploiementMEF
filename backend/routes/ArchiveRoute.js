const express = require("express");
const router = express.Router();

const { addFolderValidator, updateFolderValidator } = require("../helpers/ValidatorFolder");
const { addArchiveValidator } = require("../helpers/ValidatorArchive");

const verifyToken = require("../middlewares/verifyToken");

const { addArchive, getArchive, editArchiveById, updateArchiveById, deleteArhiveById, getArchiveByYear, getArchiveGroupedByYear } = require("../controllers/ArchiveController");

router.post("/add_archive", verifyToken, addFolderValidator, addArchive);
router.get("/get_archive", verifyToken, getArchive);
router.get("/edit_archive/:id", verifyToken, addArchiveValidator, editArchiveById);
router.put("/update_archive/:id", verifyToken, updateFolderValidator, updateArchiveById); // Nouvelle route pour mettre à jour un dossier
router.delete("/delete_archive/:id", verifyToken, updateFolderValidator, deleteArhiveById); // Nouvelle route pour mettre à jour un dossier
router.get("/archive/year/:year",verifyToken, getArchiveByYear);
router.get("/archive/grouped", verifyToken, getArchiveGroupedByYear); // Route pour récupérer toutes les archives groupées par année



module.exports = router;