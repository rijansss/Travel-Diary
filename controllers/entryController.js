const TravelEntry = require("../models/TravelEntry");

//creating entries
exports.createEntry = async (req, res) => {
  const { title, description, location, date, isPublic } = req.body;
  try {
    const imageUrls =req.files?.map((file)=>file.path)|| []
    const entry = await TravelEntry.create({
      user: req.user._id,
      title,
      description,
      location,
      date,
      isPublic,
      images:imageUrls,
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to create entry" });
  }
};

//Getting all entries
exports.getMyEntries = async (req, res) => {
  try {
    const entries = await TravelEntry.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(entries);
  } catch (error) {
    console.log("error while fetching");
  }
};

//getting single entry

exports.getEntryById = async (req, res) => {
  try {
    const entry = await TravelEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to get entry" });
  }
};

//Updating a travel entry

exports.updateEntry = async (req, res) => {
  try {
    let entry = await TravelEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { title, description, location, date, isPublic } = req.body;

    entry = await TravelEntry.findByIdAndUpdate(
      req.params.id,
      { title, description, location, date, isPublic },
      { new: true }
    );

    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to update entry" });
  }
};
//Deleting a entry

exports.deleteEntry = async (req, res) => {
  try {
    const entry = await TravelEntry.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Entry not found" });

    if (entry.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await entry.remove();
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete entry" });
  }
};
