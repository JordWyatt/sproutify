const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const router = express.Router();
const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private"
];
console.log(process.env);

const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const authorizeUrl = spotifyApi.createAuthorizeURL(scopes);

router.get("/", (req, res) => {
    res.redirect(authorizeUrl);
});

router.get("/callback", (req, res) => {
    const uri = process.env.FRONTEND_URI || "http://localhost:3000";
    const code = req.query.code;
    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.redirect(uri + "?access_token=" + data.body["access_token"]);
        })
        .catch(err => console.error(err));
});

module.exports = router;
