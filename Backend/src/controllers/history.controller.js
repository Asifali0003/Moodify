const historyModel = require("../models/history.model");
const mongoose = require("mongoose");

// ✅ SERVICE (used inside song controller)

async function saveHistoryService(userId,songId,mood){
    try{
        console.log("Saving history:", userId, songId, mood);

        if(!mongoose.Types.ObjectId.isValid(songId)) return null;
         
        const history = await historyModel.findOneAndUpdate(
            { user: userId, song: songId },
            { mood, createdAt: new Date() },
            { upsert: true, new: true }
        ).populate({
            "path": "song",
            "select": "title artist posterUrl url mood"
        })

            console.log("History Saved:", history);

        return history
    }
    catch(err){
        console.log("History Service Error:", err.message);  
        return null;
    }
}

async function saveHistory(req, res) {
    try {
        const { songId } = req.params;
        const { mood } = req.body;

        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!songId || !mood) {
            return res.status(400).json({ success: false, message: "songId and mood are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(songId)) {
            return res.status(400).json({ success: false, message: "Invalid songId" });
        }

        // ✅ Use only upsert to prevent duplicates
        const history = await saveHistoryService(
            req.user.id, 
            songId, 
            mood
        );



        if(!history){
            return res.status(500).json({ 
                success: false, 
                message: "Failed to save history" 

            });
        }

        res.status(201).json({
            success: true,
            message: "History saved successfully",
            history
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

async function getUserHistory(req, res){

    try {
        if(!req.user || !req.user.id){
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const history = await historyModel
        .find({user: req.user.id})
        .sort({createdAt: -1})
        .limit(20).
        populate({
            path: "song" ,
             select: "title artist posterUrl url mood"
            })
        .lean();

        res.status(200).json({
            message:"History fetched successfully",
            success: true,
            history
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });   
    }
};


async function deleteHistory(req, res){
    try{
        const { id } = req.params;

        // auth check
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        };

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid history id"
            })
        };

        const history = await historyModel.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if(!history){
            return res.status(404).json({
                success: false,
                message: "History not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "History deleted successfully"
        });

    } catch(err){
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

async function clearHistory(req, res){

    try{
        // auth check
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        };

        const history = await historyModel.deleteMany({user: req.user.id});


        res.status(200).json({
            success: true,
            message:"History cleared successfully",
            deletedCount:history.deletedCount
        });
    }
    catch(err) {
        res.status(500).json({
        success: false,
        error: err.message});   
    }
}


module.exports = {
    saveHistory,
    getUserHistory,
    deleteHistory,
    clearHistory,
    saveHistoryService
}