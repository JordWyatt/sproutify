const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Hello, World"));
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
