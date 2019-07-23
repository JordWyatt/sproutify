const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    spotifyId: {
        type: String,
        required: true,
        unique: true
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
