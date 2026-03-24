const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Unknown",
    },
    artist: {
      type: String,
      default: "Unknown",
    },
    album: {
      type: String,
      default: "Unknown",
    },
    genre: {
      type: String,
      default: "Unknown",
    },
    mood: {
      type: String,
      required: true,
      lowercase: true,
    },
    url: {
      type: String,
      default: "",
    },
    posterUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Optional: Index for faster mood search
songSchema.index({ mood: 1, status: 1 });


const songModel = mongoose.model("Song", songSchema);

module.exports = songModel;