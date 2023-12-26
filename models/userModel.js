const mongoose = require("mongoose");

const connect=mongoose.connect("mongodb://127.0.0.1:27017/admin");

connect.then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
    });

    const LoginSchema = new mongoose.Schema({
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true 
        },
    
        email: {
            type: String,
            required: true
        },
        phone:{
            type: Number,
            required:true
        },
        password: {
            type: String,
            required: true
        }
    });

const collection = mongoose.model("data", LoginSchema);
module.exports = collection;
