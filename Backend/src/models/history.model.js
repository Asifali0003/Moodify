const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: [true, "User is required"],
        index: true
    },
    song: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Song",
        required: [true, "Song is required"],
    },
    mood:{
        type: String,
        required: [true, "Mood is required"],
        trim: true
    }

},{timestamps: true});

historySchema.index({ user: 1, song: 1 }, { unique: true });


const historyModel = mongoose.model("History", historySchema);

module.exports = historyModel;