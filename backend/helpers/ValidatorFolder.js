const { check } = require("express-validator");

exports.addFolderValidator = [
  check("numero_bordereaux", "Numero is required").not().isEmpty(),
  check("date_depart", "Date is required").not().isEmpty(),
  check("expiditeur", "Expiditeur is required").not().isEmpty(),
  check("destination", "Destiantion is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
  check("nom_depose", "First name is required").not().isEmpty(),
  check("prenom_depose", "Last name is required").not().isEmpty(),
  check("matricule", "Matricules is required").not().isEmpty(),
];
exports.updateFolderValidator = [
  check("numero_bordereaux", "Numero is required").not().isEmpty(),
  check("date_depart", "Date is required").not().isEmpty(),
  check("expiditeur", "Expiditeur is required").not().isEmpty(),
  check("destination", "Destiantion is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
  check("nom_depose", "First name is required").not().isEmpty(),
  check("prenom_depose", "Last name is required").not().isEmpty(),
  check("matricule", "Matricules is required").not().isEmpty(),
];

exports.editFolderValidator = [
  check("id", "ID is required").not().isEmpty(),
];

exports.deleteFolderValidator = [
  check("id", "ID is required").not().isEmpty(),
];
