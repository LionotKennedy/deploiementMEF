// middlewares/isAdmin.js

const isAdmin = (req, res, next) => {
    if (req.user.role !== 1) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }
    next(); // Si l'utilisateur est un admin, on passe à la suite
  };
  
  module.exports = isAdmin;
  