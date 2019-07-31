const express = require("express");
const passport = require("passport");
const SpotifyWebApi = require("spotify-web-api-node");
const router = express.Router();
const scope = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "user-top-read"
];

const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

router.get("/spotify", passport.authenticate("spotify", { scope }));

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user
    });
  } else {
    res.redirect("failed");
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

router.get(
  "/spotify/redirect",
  passport.authenticate("spotify", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/login/failed"
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

module.exports = router;
