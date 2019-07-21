const express = require("express");
const app = express();
const PORT = process.env.PORT || 3333;

// Routes
app.use("/", require("./routes/index"));
app.use("/login", require("./routes/login"));
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
