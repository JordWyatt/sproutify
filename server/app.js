const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3333;

mongoose
    .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
    .then(() => console.log(`Connected to MongoDB`))
    .catch(err => console.log(err));

// Routes
app.use("/", require("./routes/index"));
app.use("/login", require("./routes/login"));
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
