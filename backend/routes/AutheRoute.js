const express = require("express");
const router = express.Router();
const auth = require("../middlewares/AutheMiddleware");
const { registerUser, loginUser, getProfile, logoutUser  } = require("../controllers/AutheController");
const { registerValidator, loginValidator } = require("../helpers/Validator");
const verifyToken = require("../middlewares/AutheMiddleware");
const { requestPasswordReset, resetPassword } = require("../controllers/PasswordControllers");



router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);
router.get('/profile/:id', verifyToken, getProfile);
router.post("/logout",verifyToken, logoutUser);

// Réinitialisation du mot de passe
router.post('/password_reset_request', requestPasswordReset);
router.post('/password_reset', resetPassword);

module.exports = router;