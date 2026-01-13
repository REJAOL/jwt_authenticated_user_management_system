const mongoose = require('mongoose')
const MONGODB_URI= process.env.MONGODB_URI
const connectDB = async()=>{
    await mongoose.connect(MONGODB_URI)
    console.log('mongodb is connected');
}

module.exports = connectDB