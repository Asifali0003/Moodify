const express = require("express");
const songController = require("../controllers/song.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/admin.middleware");
const upload = require("../middlewares/upload.middleware");
const {uploadSong,getSong,getUploadStatus} = require("../controllers/song.controller");

const songRouter = express.Router();


// Upload song
songRouter.post("/upload",authMiddleware,isAdmin, upload.single("song"), uploadSong);

// Get songs (by mood)
songRouter.get("/",authMiddleware, getSong);

// Get upload status
songRouter.get("/status/:id",authMiddleware,isAdmin,getUploadStatus);

module.exports = songRouter;