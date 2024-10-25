const { check } = require("express-validator");

exports.permissionAddValidator = [
  check("permission_name", "Permission name is required").not().isEmpty(),
];

exports.permissionDeleteValidator = [
  check("id", "ID is required").not().isEmpty(),
];

exports.permissionUpdateValidator = [
  check("permission_name", "Permission Name is required").not().isEmpty(),
];

exports.categoryAddValidator = [
  check("category_name", "Category Name is required").not().isEmpty(),
];

exports.categoryDeleteValidator = [
  check("id", "ID is required").not().isEmpty(),
];

exports.categoryUpdateValidator = [
  check("id", "ID is required").not().isEmpty(),
  check("category_name", "Category Name is required").not().isEmpty(),
];

exports.postAddValidator = [
  check("title", "Title is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
];

exports.postDeleteValidator = [check("id", "ID is required").not().isEmpty()];

exports.postUpdateValidator = [
  check("id", "ID is required").not().isEmpty(),
  check("title", "title is required").not().isEmpty(),
  check("description", "description is required").not().isEmpty(),
];
