// const mongoose = require("mongoose");

// const TokenSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Users',
//     required: true
//   },
//   token: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     expires: '2h', // Le token expirera après 2 heures
//   },
//   expiresAt: {
//     type: Date, // Stocke la date d'expiration
//     required: true
//   }
// });

// TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// const Token = mongoose.model("Token", TokenSchema);
// module.exports = Token;





// const mongoose = require("mongoose");

// const TokenSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Users',
//     required: true
//   },
//   token: {
//     type: String,
//     required: true,
//   },
//   expires: {
//     type: Date,
//     default: Date.now,
//     expires: '3h'
//   }
// });

// const Token = mongoose.model("Token", TokenSchema);
// module.exports = Token;
















// const mongoose = require("mongoose");

// const TokenSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Users',
//     required: true
//   },
//   token: {
//     type: String,
//     required: true,
//   },
//   expires: {
//     type: Date,
//     default: Date.now,
//     // expires: '6h'  // Expire automatiquement après 3 heures
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Token = mongoose.model("Token", TokenSchema);
// module.exports = Token;















// const mongoose = require("mongoose");

// const TokenSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Users',
//     required: true
//   },
//   token: {
//     type: String,
//     required: true
//   },
//   expiresAt: {
//     type: Date,
//     // default: () => new Date(Date.now() + 3 * 24 * 60 * 1000), // 3 jours par défaut
//     // default: () => new Date(Date.now() + 30 * 24 * 60 * 1000), // 30 jours par défaut pour les tokens de connexion
//     default: () => new Date(Date.now() + 7 * 24 * 60 * 1000), // 7 jours par défaut pour les tokens de connexion
//     index: { expireAfterSeconds: 0 } // Crée un index de TTL pour MongoDB
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Token = mongoose.model("Token", TokenSchema);
// module.exports = Token;








// const mongoose = require("mongoose");

// const TokenSchema = new mongoose.Schema({
  //   userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Users',
    //     required: true
    //   },
    //   token: {
      //     type: String,
      //     required: true
      //   },
      //   // expiresAt: {
        //   //   type: Date,
        //   //   default: Date.now,
        //   //   // index: { expireAfterSeconds: 0 } // Crée un index de TTL pour MongoDB
        //   // },
        //   // expiresIn: {
          //   //   type: Date,
          //   //   default: Date.now,
          //   //   // index: { expireAfterSeconds: 0 } // Crée un index de TTL pour MongoDB
          //   // },
          //   createdAt: {
            //     type: Date,
            //     default: Date.now,
            //     expires: '48h', // Le token expirera après 2 heures
            //   }
            // });

// const Token = mongoose.model("Token", TokenSchema);
// module.exports = Token;




















// const mongoose = require("mongoose");
// const TokenSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Users',
//     required: true
//   },
//   token: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     expires: '7d', // Le token expirera après 7 jours
//   }
// });

// TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 3600 }); // 7 jours en secondes

// const Token = mongoose.model("Token", TokenSchema);
// module.exports = Token;








const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Supprimer l'index qui force l'expiration automatique après 7 jours
// TokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 3600 });

const Token = mongoose.model("Token", TokenSchema);
module.exports = Token;


