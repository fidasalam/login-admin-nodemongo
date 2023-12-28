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

// Define DeletedUserSchema
    const DeletedUserSchema = new mongoose.Schema({
        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserData', // Reference to the LoginSchema model
            required: true
        },
        deletedAt: {
            type: Date,
            default: Date.now,
            required: true
        },
       
       
    });
    

    const CombinedSchema = {
        collection: mongoose.model('UserData', LoginSchema),
        DeletedUser: mongoose.model('DeletedUserData', DeletedUserSchema)
    };
module.exports = CombinedSchema;
