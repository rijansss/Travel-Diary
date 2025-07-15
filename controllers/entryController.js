const TravelEntry = require("../models/TravelEntry");

//creating entries
exports.createEntry = async (req, res) => {
  const { title, description, location, date, isPublic } = req.body;
  try {
    const imageUrls = req.files?.map((file) => file.path) || [];
    const entry = await TravelEntry.create({
      user: req.user._id,
      title,
      description,
      location,
      date,
      isPublic,
      images: imageUrls,
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

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const year = req.query.year || new Date().getFullYear();

    // Step 1: Fetch all user's entries in the selected year
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${+year + 1}-01-01`);

    const entries = await TravelEntry.find({
      user: userId,
      date: { $gte: start, $lt: end },
    });

    const total = entries.length;
    const publicCount = entries.filter((e) => e.isPublic).length;
    const privateCount = total - publicCount;

    // Step 2: Group by month
    const monthlyCounts = Array(12).fill(0); // [0, 0, ..., 0]

    entries.forEach((entry) => {
      const month = new Date(entry.date).getMonth(); // 0 - 11
      monthlyCounts[month]++;
    });

    res.json({
      year,
      total,
      public: publicCount,
      private: privateCount,
      monthly: monthlyCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

exports.toggleLikeEntry = async (req, res) => {
  const entry = await TravelEntry.findById(req.params.id);

  if (!entry) return res.status(404).json({ message: "Entry not found" });

  const userId = req.user._id;
  const liked = entry.likes.includes(userId);

  if (liked) {
    entry.likes.pull(userId); // unlike
  } else {
    entry.likes.push(userId); // like
  }

  await entry.save();
  res.json({ liked: !liked, totalLikes: entry.likes.length });
};

exports.toggleBookmarkEntry = async (req, res) => {
  const entry = await TravelEntry.findById(req.params.id);

  if (!entry) return res.status(404).json({ message: "Entry not found" });

  const userId = req.user._id;
  const bookmarked = entry.bookmarkedBy.includes(userId);

  if (bookmarked) {
    entry.bookmarkedBy.pull(userId);
  } else {
    entry.bookmarkedBy.push(userId);
  }

  await entry.save();
  res.json({ bookmarked: !bookmarked });
};

exports.getBookmarkedEntries = async (req, res) => {
  const userId = req.user._id;

  const entries = await TravelEntry.find({
    bookmarkedBy: userId,
  }).populate("user", "name");

  res.json(entries);
};

exports.commentOnEntry = async (req, res) => {
  const { text } = req.body;
  const entry = TravelEntry.findById(req.params.id);
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  const newComment = {
    user: req.user._id,
    text,
  };
  entry.comments.push(newComment);
  await entry.save();

  res.status(201).json({ message: "Comment added", comment: newComment });
};

exports.getEntryComments = async (req, res) => {
  const entry = await TravelEntry.findById(req.params.Id)
    .populate("comments.user", "name")
    .select("comments");
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  res.json(entry.comments);
};
