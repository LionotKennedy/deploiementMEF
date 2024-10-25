const { check } = require("express-validator");

exports.addVisaValidator = [
  check("numero_visa", "Numero is required").not().isEmpty(),
  check("nom_depose_visa", "First name is required").not().isEmpty(),
  check("prenom_depose_visa", "Last name is required").not().isEmpty(),
  check("reference", "Reference is required").not().isEmpty(),
];
exports.editVisaValidator = [
  check("id", "ID is required").not().isEmpty(),
];