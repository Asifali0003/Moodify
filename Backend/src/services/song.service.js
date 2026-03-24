const songModel = require("../models/song.model");
const storageService = require("./storage.service");
const { saveHistoryService } = require("../controllers/history.controller");
const id3 = require("node-id3");
const mongoose = require("mongoose");

// ---------------------- Upload Song ----------------------
async function uploadSong(req) {
  if (!req.file) throw new Error("Song file is required");

  const { mood } = req.body;
  if (!mood) throw new Error("Mood is required");

  const songBuffer = req.file.buffer;
  const tags = id3.read(songBuffer);

  const tempId = new mongoose.Types.ObjectId();

  // ✅ Create initial DB entry
  await songModel.create({
    _id: tempId,
    title: tags.title || "Unknown",
    artist: tags.artist || "Unknown",
    mood: mood.toLowerCase(),
    status: "processing",
  });

  console.log("📦 Upload started:", tempId.toString());

  // ✅ Background upload
  process.nextTick(() => handleUpload(tempId, songBuffer, tags));

  return {
    tempId,
    status: "processing",
  };
}

// ---------------------- Background Upload ----------------------
async function handleUpload(tempId, songBuffer, tags) {
  try {
    console.log("⬆️ Uploading:", tempId.toString());

    const songFile = await storageService.uploadFile({
      buffer: songBuffer,
      filename: (tags.title || "song") + ".mp3",
      folder: "moodify/songs",
    });

    const updatedSong = await songModel.findByIdAndUpdate(
      tempId,
      {
        url: songFile.url,
        status: "completed",
      },
      { new: true }
    );

    console.log("✅ Upload completed:", {
      id: updatedSong._id,
      title: updatedSong.title,
    });

  } catch (err) {
    console.log("❌ Upload failed:", tempId.toString(), err.message);

    await songModel.findByIdAndUpdate(
      tempId,
      { status: "failed" },
      { new: true }
    );
  }
}

// ---------------------- Get Upload Status ----------------------
async function getUploadStatus(id) {
  const song = await songModel.findById(id);

  if (!song) throw new Error("Song not found");

  console.log("🔍 Status check:", {
    id,
    status: song.status,
  });

  return {
    status: song.status,
    song,
  };
}

// ---------------------- Get Songs (RANDOM AUTOPLAY) ----------------------
async function getSong(req) {
  const { mood } = req.query;

  let playlist = await songModel
    .find({
      ...(mood && { mood: mood.toLowerCase() }),
      status: "completed",
    })
    .select("title artist posterUrl url mood");

  // ✅ Fallback: random songs if mood not found
  if (!playlist.length) {
    console.log("⚠️ No mood songs, fetching random songs");

    playlist = await songModel.aggregate([
      { $match: { status: "completed" } },
      { $sample: { size: 10 } },
    ]);
  }

  // ❌ No songs at all
  if (!playlist.length) {
    return {
      playlist: [],
      currentSong: null,
      message: "No songs available",
    };
  }

  // ✅ ALWAYS random selection
  const randomIndex = Math.floor(Math.random() * playlist.length);
  const currentSong = playlist[randomIndex];

  console.log("🎵 Randomly selected song:", {
    index: randomIndex,
    title: currentSong.title,
  });

  // ✅ Save history (non-blocking)
  if (req.user?.id && currentSong?._id) {
    saveHistoryService(
      req.user.id,
      currentSong._id,
      currentSong.mood || mood || "unknown"
    ).catch((err) =>
      console.log("History Error:", err.message)
    );
  }

  return {
    playlist,
    currentSong,
  };
}

module.exports = {
  uploadSong,
  getUploadStatus,
  getSong,
};