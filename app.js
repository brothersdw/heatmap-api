const express = require("express");
const axios = require("axios");
const app = express();
const port = 3008;
const routes = require("./routes");

app.use("/", routes);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
