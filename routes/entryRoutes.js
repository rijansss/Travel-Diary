const express=require('express')
const router=express.Router();
const upload = require("../middleware/upload");


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
} = require("../controllers/entryController");


const protect = require("../middleware/authMiddleware");
router.post('/',protect,upload.array("images",5),createEntry);

router.get("/", protect, getMyEntries);

router.put("/like/:id", protect, toggleLikeEntry);

// Bookmark/unbookmark
router.put("/bookmark/:id", protect, toggleBookmarkEntry);

// Get all bookmarks
router.get("/bookmarks", protect, getBookmarkedEntries);

router.get("/stats", protect, getUserStats);





router.get("/:id", protect, getEntryById);

router.put("/:id", protect, upload.array("images", 5), updateEntry);

router.delete("/:id", protect, deleteEntry);






module.exports=router