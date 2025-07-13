const express=require('express')
const router=express.Router();
const upload = require("../middleware/upload");

const {
  createEntry,
  getMyEntries,
  getEntryById,
  updateEntry,
  deleteEntry,
} = require("../controllers/entryController");


const protect = require("../middleware/authMiddleware");
router.post('/',protect,upload.array("images",5),createEntry);

router.get("/", protect, getMyEntries);

router.get("/:id", protect, getEntryById);

router.put("/:id", protect, updateEntry);

router.delete("/:id", protect, deleteEntry);


module.exports=router