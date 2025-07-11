const mongoose=require("mongoose");

const connectDB = async()=>{
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MONGODB Connected Successfully")
  } catch (error) {
    console.log("error while connecting to database")
  }
}
module.exports=connectDB;