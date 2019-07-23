const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const router = express.Router();
const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private"
];

const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const authorizeUrl = spotifyApi.createAuthorizeURL(scopes);

router.get("/", (req, res) => {
    res.redirect(authorizeUrl);
});

router.get("/callback", async (req, res) => {
    try {
        const uri = process.env.FRONTEND_URI || "http://localhost:3000";
        const code = req.query.code;
        const tokens = await spotifyApi.authorizationCodeGrant(code);
        const { access_token } = tokens.body;
        console.log(`${uri}?access_token=${access_token}`);
        res.redirect(`${uri}?access_token=${access_token}`);
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
