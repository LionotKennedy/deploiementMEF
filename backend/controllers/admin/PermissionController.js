const Permission = require("../../models/Permission");

const { validationResult } = require("express-validator");

// ############### ADD PERMISSION #################//
const addPermission = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: true,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { permission_name } = req.body;

    const isExistUser = await Permission.findOne({
      permission_name: {
        $regex: permission_name,
        $options: "i",
      },
    });

    if (isExistUser) {
      return res.status(200).json({
        success: false,
        message: "Permission name already exists",
      });
    }

    var obj = {
      permission_name,
    };

    if (req.body.default) {
      obj.is_default = parseInt(req.body.default);
    }
    const permissions = new Permission(obj);

    const newPermission = await permissions.save();

    return res.status(200).json({
      success: true,
      message: "Successfully added of permission",
      data: newPermission,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

// ############### GET PERMISSION #################//
const getPermission = async (req, res) => {
  try {
    const permissions = await Permission.find();
    return res.status(200).json({
      success: true,
      message: "All permission",
      data: permissions,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

// ############### DELETE #################//
const deletePermission = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: true,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { id } = req.body;

    await Permission.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      success: true,
      message: "Permission deleted",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
// ############### ENDING #################//

// ############### UPDATE PERMISSION #################//
const updatePermission = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(200).json({
        success: true,
        message: "Errors",
        errors: errors.array(),
      });
    }

    const { id, permission_name } = req.body;

    const isExistUser = await Permission.findOne({ _id: id });

    if (!isExistUser) {
      return res.status(400).json({
        success: false,
        message: "Permission id not found",
      });
    }

    const isNameAssigned = await Permission.findOne({
      _id: { $ne: id },
      permission_name: {
        $regex: permission_name,
        $options: "i",
      },
    });

    if (isNameAssigned) {
      return res.status(400).json({
        success: false,
        message: "Permission name already assigned to another permission",
      });
    }

    var updatePermission = {
      permission_name,
    };

    if (req.body.default != null) {
      updatePermission.is_default = parseInt(req.body.default);
    }

    const updatedPermission = await Permission.findOneAndUpdate(
      { _id: id },
      {
        $set: updatePermission,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully added of permission",
      data: updatedPermission,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Permission id is not found",
    });
  }
};
// ############### ENDING #################//

module.exports = {
  addPermission,
  getPermission,
  deletePermission,
  updatePermission,
};
