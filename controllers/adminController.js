const TravelEntry = require("../models/TravelEntry");

exports.getAllEntriesAdmin = async (req, res) => {
  try {
    const entries = await TravelEntry.find().populate("user", "name email");
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch entries" });
  }
};

exports.deleteAnyEntry = async (req, res) => {
  try {
    await TravelEntry.findByIdAndDelete(req.params.id);
    res.json({ message: "Entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.flagEntryAsReported = async (req, res) => {
  try {
    const entry = await TravelEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    entry.reported = true;
    await entry.save();

    res.json({ message: "Entry marked as reported" });
  } catch (err) {
    res.status(500).json({ message: "Reporting failed" });
  }
};

exports.markEntryAsReviewed = async (req, res) => {
  try {
   const entry = await TravelEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    
    entry.reviewed = true;
    entry.reported = false;
    await entry.save();
    res.json({ message: "Entry marked as reviewed" });
  } catch (err) {
    res.status(500).json({ message: "Review failed" });
  }
};