
const mongoose = require('mongoose');
const Archive = require("../models/Archive");
const Nature = require("../models/Nature");
const Courrier = require("../models/Courrier");
const dotenv = require("dotenv");
dotenv.config();

const CONNECTION = process.env.MONGODB_CONNECTION;

async function archiveOldData() {
  try {
    // Log pour confirmer que la fonction s'exécute bien
    console.log("Exécution de la fonction archiveOldData...");

    // Date de la nouvelle année
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    // Récupérer les courriers avant le début de l'année courante
    const courriers = await Courrier.find({ "date_depart": { $lt: startOfYear } })
      .populate("id_nature");

    if (courriers.length === 0) {
      console.log("Aucun courrier à archiver.");
      return;
    }

    // Transformer les courriers pour les archives
    const formattedCourriers = courriers.map(courrier => ({
      description: courrier.id_nature.description || 'N/A',
      nom_depose: courrier.id_nature.nom_depose || 'N/A',
      prenom_depose: courrier.id_nature.prenom_depose || 'N/A',
      matricule: courrier.id_nature.matricule || 'N/A',
      numero_bordereaux: courrier.numero_bordereaux || 'N/A',
      date_depart: courrier.date_depart,
      expiditeur: courrier.expiditeur || 'N/A',
      destination: courrier.destination || 'N/A'
    }));

    console.log("Courriers à archiver :", formattedCourriers);

    // Ajouter aux archives
    await Archive.insertMany(formattedCourriers);

    // Supprimer les courriers et natures associés
    await Promise.all([
      Courrier.deleteMany({ "date_depart": { $lt: startOfYear } }),
      Nature.deleteMany({ _id: { $in: courriers.map(c => c.id_nature._id) } })
    ]);

    console.log("Archivage terminé.");
  } catch (error) {
    console.error("Erreur lors de l'archivage :", error);
  }
}

// Fonction pour vérifier et archiver
async function checkAndArchive() {
  console.log("Vérification à", new Date().toLocaleString());

  // Appelle la fonction d'archivage à chaque intervalle, peu importe la date actuelle
  await archiveOldData();
}

// Exécution toutes les minutes
setInterval(checkAndArchive, 60 * 1000);

module.exports = { archiveOldData, checkAndArchive };
