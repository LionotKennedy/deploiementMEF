

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// routes
const authRoute = require("./routes/AutheRoute");
const adminRoute = require("./routes/AdminRoute");
const commonRoute = require("./routes/commonRoute");
const folderRoute = require("./routes/FolderRoute");
const archiveRoute = require("./routes/ArchiveRoute");
const journalRoute = require("./routes/JournalRoute");
const visaRoute = require("./routes/VisaRoute");

const app = express();

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Servir des fichiers statiques (images) depuis le dossier "uploads"
app.use('/uploads', express.static('uploads'));

dotenv.config();
const PORT = process.env.PORT || 3000;

const CONNECTION = process.env.MONGODB_CONNECTION;

const xy = mongoose.connect(CONNECTION);

if (xy == null) {
  console.log("Connexion failed, try again");
} else {
  console.log("Connexion is stable");
}

const journalCleanup = require("./modules/journalCleanup");
// const { archiveOldDatas } = require("./modules/automate");
// const { archiveOldData } = require("./modules/automate");
const { archiveOldData, checkAndArchive } = require("./modules/automate");
const { setupTokenCleanup } = require("./modules/tokenCleanup");
// const { cleanupExpiredTokens } = require("./modules/tokenCleanup");

app.use("/api", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api", commonRoute);
app.use("/api", folderRoute);
app.use("/api", archiveRoute);
app.use("/api", journalRoute);
app.use("/api", visaRoute); 

// Démarre le job de nettoyage des journaux
journalCleanup.setupJournalCleanup();
// archiveOldDatas.archiveOldData();

// Démarrer l'archivage au démarrage
archiveOldData();

// Planifier la vérification d'archivage toutes les minutes
setInterval(checkAndArchive, 60 * 1000);


setupTokenCleanup();
// cleanupExpiredTokens();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});