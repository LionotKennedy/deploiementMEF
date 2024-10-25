
const mongoose = require("mongoose");

const JournalSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      required: false,
    },
    adressEmail: {
      type: String,
      required: false,
    },
    imageJournale: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Journal = mongoose.model("Journals", JournalSchema);
module.exports = Journal;
