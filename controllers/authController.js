const User=require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


//Registering a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
 
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.login =async(req,res)=>{
  const {email,password}=req.body;
  try {
    const user = await User.findOne({email})    
    if(!user) return res.status(400).json({message:"Invalid Credentials"});

const isMatch= await bcrypt.compare(password,user.password)
 if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

 const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};