const mongoose = require("mongoose");

const UserPermissionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Users",
  },
  permissions: [
    {
      permission_name: String,
      permission_value: [Number], // 0 -> Create, 1 -> read, 2 -> update, 3 -> Delete
    },
  ],
});

const UserPermission = mongoose.model("UserPermissions", UserPermissionSchema);
module.exports = UserPermission;