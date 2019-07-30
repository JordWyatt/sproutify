const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const router = express.Router();

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const setAccessToken = req => {
  const { accessToken } = req.user;
  spotifyApi.setAccessToken(accessToken);
};

router.get("/topArtists", (req, res) => {
  setAccessToken(req);
  spotifyApi
    .getMyTopArtists()
    .then(data => {
      const { items } = data.body;
      res.send(items.map(x => x.name));
    })
    .catch(e => console.log(e));
});

module.exports = router;
