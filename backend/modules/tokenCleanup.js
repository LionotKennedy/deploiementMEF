

const Token = require("../models/Token");

async function cleanupExpiredTokens() {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 7); // Date actuelle - 3 jours

    // Suppression des tokens dont la date d'expiration est plus ancienne que 3 jours
    const result = await Token.deleteMany({
      // expiresAt: { $lt: threeDaysAgo },
      // expiresIn: { $lt: threeDaysAgo },
      createdAt: { $lt: threeDaysAgo },
    });

    if (result.deletedCount > 0) {
      console.log(`${result.deletedCount} token(s) expiré(s) supprimé(s).`);
    } else {
      console.log("Aucun token expiré trouvé.");
    }
  } catch (error) {
    console.error("Erreur lors du nettoyage des tokens expirés :", error);
  }
}

function setupTokenCleanup() {
  setInterval(cleanupExpiredTokens, 60000); // Exécute le nettoyage toutes les minutes
  // setInterval(cleanupExpiredTokens, 3600000); // Exécute le nettoyage toutes les heures
}

module.exports = {
  setupTokenCleanup,
};
