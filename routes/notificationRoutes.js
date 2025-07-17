const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Notification = require("../models/Notification");

// Get all notifications
router.get("/", protect, async (req, res) => {
  const notes = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notes);
});

// Mark all as read
router.put("/mark-all-read", protect, async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { isRead: true });
  res.json({ message: "All notifications marked as read" });
});
