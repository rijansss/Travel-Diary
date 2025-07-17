const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // the user who should receive it
    },
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // the one who triggered it
    },
    entry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelEntry",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "bookmark"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
