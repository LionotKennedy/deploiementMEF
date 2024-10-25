const { check } = require("express-validator");


exports.addArchiveValidator = [
    check("id", "ID is required").not().isEmpty(),
  ];
  