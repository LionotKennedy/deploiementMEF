const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const {
  addVisaValidator,
  editVisaValidator,
} = require("../helpers/ValidatorVisa");
const {
  addArchive,
  getVisa,
  editVisaById,
  updateVisa,
  deleteVisa,
} = require("../controllers/VisaController");

router.post("/add_visa", verifyToken, addVisaValidator, addArchive);
router.get("/get_visa", verifyToken, getVisa);
router.get("/edit_visa/:id", verifyToken, editVisaValidator, editVisaById);
router.put("/update_visa/:id", verifyToken, addVisaValidator, updateVisa);
router.delete("/delete_visa/:id", verifyToken, editVisaValidator, deleteVisa);

module.exports = router;
