const TravelEntry = require("../models/TravelEntry");

//creating entries
exports.createEntry =async(req,res)=>{
const { title, description, location, date, isPublic } = req.body; 
  try{
   const entry= await TravelEntry.create({
      user: req.user._id,
      title,
      description,
      location,
      date,
      isPublic,
  })
   res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: "Failed to create entry" });
  }
};

//Getting all entries
exports.getMyEntries=async(req,res)=>{
  try {
   const entries = await TravelEntry.find({ user: req.user._id }).sort({ createdAt: -1 }); 

    res.json(entries)
  } catch (error) {
    console.log("error while fetching")
  }
}

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
