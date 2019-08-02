const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const router = express.Router();

const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

const setAccessToken = (req, res, next) => {
  if (req.user) {
    const { accessToken } = req.user;
    spotifyApi.setAccessToken(accessToken);
    next();
  } else {
    res.status(401).send("Please provide a valid access token");
  }
};

router.use(setAccessToken);

router.get("/searchTracks", (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.status(400).send("Please provide a search term");
  }
  spotifyApi
    .searchTracks(q, { limit: 10 })
    .then(data => {
      const tracks = data.body.tracks.items;
      res.json(tracks);
    })
    .catch(e => console.log(e));
});

router.get("/searchArtists", (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.status(400).send("Please provide a search term");
  }
  spotifyApi
    .searchArtists(q, { limit: 10 })
    .then(data => {
      const artists = data.body.artists.items;
      res.json(artists);
    })
    .catch(e => console.log(e));
});

router.get("/topArtists", (req, res) => {
  spotifyApi
    .getMyTopArtists()
    .then(data => {
      const { items } = data.body;
      res.send(items.map(x => x.name));
    })
    .catch(e => console.log(e));
});

module.exports = router;
