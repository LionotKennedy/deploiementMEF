
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/", // Dossier où les images seront sauvegardées
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 4000000 }, // Limite de 4MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb("Error: Images only!");
    }
  },
});

module.exports = { upload };
