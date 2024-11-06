const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        unique:true
    },
    authToken:String,
    gender: {
        type: String,
    },
    Your_Partners_First_Name: {
        type: String,
    },
    Budget: Number,
    Date: String,
    Location: String,
    Guests: Number,
    guestList: [{
        name:String,
        email:String
    }],
    task: [{
        name:String,
        description:String,
        id:Number
    }]
})

const userModel = mongoose.model('Users', userSchema);

module.exports = userModel;