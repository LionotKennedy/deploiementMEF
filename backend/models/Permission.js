const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
  permission_name: {
    type: String,
    required: true,
  },
  is_default: {
    type: Number,
    default: 0,
  },
});

const Permission = mongoose.model("Permissions", PermissionSchema);
module.exports = Permission;
