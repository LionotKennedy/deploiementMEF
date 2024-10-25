const express = require("express");
const router = express.Router();

const { upload } = require("../configs/multer");


const {
  getUsers,
  editUsers,
  updateUsers,
  deleteUsers,
  createUsers,
  UpdateRoleStatus,
  UpdatePassword,
  updateUsersEmailName,
} = require("../controllers/UserController");

const verifyToken = require("../middlewares/verifyToken");

const isAdmin = require("../middlewares/isAdmin");

// User
router.get("/get_user", verifyToken, getUsers);
router.get("/edit_user/:id", verifyToken, editUsers);
router.delete("/delete_user/:id", verifyToken, deleteUsers);
router
  .route("/update_user/:id")
  .put(upload.single("image"), verifyToken, updateUsers);

// Protected route: Only admin can create users
router.post(
  "/add_user",
  upload.single("image"),
  verifyToken,
  isAdmin,
  createUsers
);
router.put("/update_role_status/:id", verifyToken, UpdateRoleStatus);
router.put("/update_password/:id", verifyToken, UpdatePassword);
router.put("/update_email__name/:id", verifyToken, updateUsersEmailName);

module.exports = router;
