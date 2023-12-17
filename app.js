const express = require("express");
const axios = require("axios");
const app = express();
const port = 3008;
const routes = require("./routes");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3006", // Replace with your frontend's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: false, // Enable credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions));
app.use("/", routes);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
