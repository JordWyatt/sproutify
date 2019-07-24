const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const ensureAuthenticated = require("./config/auth");

const app = express();
const PORT = process.env.PORT || 3333;

require("./config/passport")(passport);

mongoose
    .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
    .then(() => console.log(`Connected to MongoDB`))
    .catch(err => console.log(err));

// Express session middleware
app.use(
    session({
        secret: "secret"
    })
);

// set up cors to allow us to accept requests from our client
app.use(
    cors({
        origin: "http://localhost:3000", // allow to server to accept request from different origin
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
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
