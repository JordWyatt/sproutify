const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    spotifyId: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String,
        required: true
    },
    accessTokenExpiry: {
        type: Date,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
