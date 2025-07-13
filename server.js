const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const entryRoutes=require('./routes/entryRoutes')
const connectDB = require("./config/db");

connectDB();

const app=express()

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/entries',entryRoutes)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});