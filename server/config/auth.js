function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  }
}

module.exports = ensureAuthentication;
