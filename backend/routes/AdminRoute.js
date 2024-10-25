const express = require("express");
const router = express.Router();

const auth = require("../middlewares/AutheMiddleware");
const { onlyAdminAccess } = require("../middlewares/AdminMiddleware");
const {
  addPermission,
  getPermission,
  deletePermission,
  updatePermission,
} = require("../controllers/admin/PermissionController");

router.post("/add_permission", auth, onlyAdminAccess, addPermission);
router.get("/get_permission", auth, onlyAdminAccess, getPermission);
router.delete("/delete_permission", auth, onlyAdminAccess, deletePermission);
router.put("/update_permission", auth, onlyAdminAccess, updatePermission);

module.exports = router;
