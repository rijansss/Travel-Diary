const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { isAdmin } = require("../middleware/adminMiddleware");

const {
  getAllEntriesAdmin,
  deleteAnyEntry,
  flagEntryAsReported,
  markEntryAsReviewed
} = require("../controllers/adminController");

const {
  createEntry,
  getMyEntries,
  getEntryById,
  getUserStats,
  updateEntry,
  deleteEntry,
  toggleLikeEntry,
  toggleBookmarkEntry,
  getBookmarkedEntries,
  commentOnEntry,
  getEntryComments,
} = require("../controllers/entryController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, upload.array("images", 5), createEntry);

router.get("/", protect, getMyEntries);

router.get("/stats", protect, getUserStats);

// Get all bookmarks
router.get("/bookmarks", protect, getBookmarkedEntries);
// Get all comments for a post
router.get("/:id/comments", getEntryComments);
// Add comment
router.post("/:id/comment", protect, commentOnEntry);

router.put("/like/:id", protect, toggleLikeEntry);

// Bookmark/unbookmark
router.put("/bookmark/:id", protect, toggleBookmarkEntry);


router.get("/:id", protect, getEntryById);

router.put("/:id", protect, upload.array("images", 5), updateEntry);

router.delete("/:id", protect, deleteEntry);


//Admin Routes

// Admin: Get all entries
router.get("/admin/all", protect, isAdmin, getAllEntriesAdmin);

// Admin: Delete any entry
router.delete("/admin/:id", protect, isAdmin, deleteAnyEntry);

// Admin: Mark as reported
router.put("/admin/:id/report", protect, isAdmin, flagEntryAsReported);

// Admin: Mark as reviewed
router.put("/admin/:id/review", protect, isAdmin, markEntryAsReviewed);

module.exports = router;
