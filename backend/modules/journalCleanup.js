const mongoose = require("mongoose");
const Journal = require("../models/Journal");

// Fonction pour formater la date au format "dd/MM/yyyy"
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

// Fonction pour réinitialiser les heures à minuit
function resetTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Fonction pour calculer la différence en jours entre deux dates
function calculateDifferenceDays(date1, date2) {
  const date1Midnight = resetTime(date1);
  const date2Midnight = resetTime(date2);

  const diffTime = date2Midnight - date1Midnight;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

async function setupJournalCleanup() {
  const db = mongoose.connection;
  console.log("Début de la connexion MongoDB...");

  db.on("open", async () => {
    console.log("Connexion MongoDB établie");

    const handleChanges = async () => {
      console.log("Commencement de la vérification des journaux...");

      try {
        // Récupérer la date actuelle
        const now = new Date();
        const formattedNow = formatDate(now);
        console.log(`Date actuelle: ${formattedNow}`);

        // Récupérer tous les journaux dans la collection Journal
        const allJournals = await Journal.find();

        if (allJournals.length > 0) {
          console.log(`Journaux trouvés (${allJournals.length}) :`);

          const journalDates = allJournals.map((journal) => {
            return {
              id: journal._id,
              date: formatDate(journal.createdAt),
              differenceDays: calculateDifferenceDays(journal.createdAt, now),
            };
          });

          journalDates.forEach((journal) => {
            console.log(
              `Journal ID: ${journal.id}, Date de création: ${journal.date}, Décalage: ${journal.differenceDays} jours`
            );
          });

          // Supprimer uniquement les journaux dont la différence est d'au moins 1 jour
          const outdatedJournals = journalDates.filter(
            (journal) => journal.differenceDays >= 30
          );

          if (outdatedJournals.length > 0) {
            console.log("\nJournaux obsolètes (décalage d'au moins 1 jour):");
            outdatedJournals.forEach((journal) => {
              console.log(
                `ID: ${journal.id}, Date: ${journal.date}, Décalage: ${journal.differenceDays} jours`
              );
            });

            await Journal.deleteMany({
              _id: { $in: outdatedJournals.map((j) => j.id) },
            });
            console.log(
              `Supprimé ${outdatedJournals.length} journaux obsolètes.`
            );
          } else {
            console.log("Aucun journal obsolète trouvé.");
          }
        } else {
          console.log("Aucun journal trouvé dans la base de données.");
        }
      } catch (err) {
        console.error("Erreur lors de la vérification des journaux:", err);
      }
    };

    handleChanges();
    setInterval(handleChanges, 60 * 1000);
  });

  db.on("close", () => {
    console.log("Connexion MongoDB fermée");
  });
}

module.exports = { setupJournalCleanup };
