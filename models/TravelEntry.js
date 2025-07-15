const mongoose = require("mongoose");

const travelEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  location: { 
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  images: [String], 
  likes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
bookmarkedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],

}, { timestamps: true });

module.exports = mongoose.model("TravelEntry", travelEntrySchema);
