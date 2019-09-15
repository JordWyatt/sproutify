const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3333;

dotenv.config();

require("./config/passport")(passport);

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => console.log(`Connected to MongoDB`))
  .catch(err => console.log(err));

app.use(express.static(path.join(__dirname, "client", "build")));

// Express session middleware
app.use(
  session({
    secret: process.env.SECRET || "secret",
    resave: false,
    saveUninitialized: false
  })
);

// body parser
app.use(express.urlencoded({ extended: false }));

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: process.env.CLIENT_URL, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/spotify", require("./routes/spotify"));

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
