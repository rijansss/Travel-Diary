const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // the receiver of the notification
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  link: {
    type: String, // e.g., `/entries/64ff...`
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
