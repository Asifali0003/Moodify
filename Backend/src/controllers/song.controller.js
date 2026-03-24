// controllers/song.controller.js

const songService = require("../services/song.service");

// ---------------------- Upload Song ----------------------
async function uploadSong(req, res) {
  try {
    const result = await songService.uploadSong(req);

    return res.status(202).json({
      success: true,
      message: "🎵 Song upload started. Processing in background...",
      data: {
        tempId: result.tempId,
        status: "processing",
      },
    });

  } catch (err) {
    console.error("❌ Upload Error:", err.message);

    return res.status(400).json({
      success: false,
      message: err.message || "Failed to upload song",
    });
  }
}

// ---------------------- Get Upload Status ----------------------
async function getUploadStatus(req, res) {
  try {
    const { id } = req.params;

    const data = await songService.getUploadStatus(id);

    // 🎯 Dynamic message based on status
    let message = "";

    if (data.status === "processing") {
      message = "⏳ Song is still uploading...";
    } else if (data.status === "completed") {
      message = "✅ Song uploaded successfully!";
    } else if (data.status === "failed") {
      message = "❌ Song upload failed. Please try again.";
    }

    return res.status(200).json({
      success: true,
      message,
      data,
    });

  } catch (err) {
    console.error("❌ Status Error:", err.message);

    return res.status(
      err.message === "Song not found" ? 404 : 500
    ).json({
      success: false,
      message: err.message,
    });
  }
}

// ---------------------- Get Song ----------------------
async function getSong(req, res) {
  try {
    const data = await songService.getSong(req);

    let message = "";

    if (!data.playlist.length) {
      message = "⚠️ No songs available right now";
    } else if (!req.query.mood) {
      message = "🎧 Playing random songs for you";
    } else {
      message = `🎵 Songs fetched for mood: ${req.query.mood}`;
    }

    return res.status(200).json({
      success: true,
      message,
      data: {
        playlist: data.playlist,
        currentSong: data.currentSong,
      },
    });

  } catch (err) {
    console.error("❌ Get Song Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch songs",
    });
  }
}

module.exports = {
  uploadSong,
  getUploadStatus,
  getSong,
};