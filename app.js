const express = require("express");
const app = express();
const port = 3008; // Set port
const routes = require("./routes"); // Import all routes
const cors = require("cors"); // !IMPORTANT - Import cors. This is so that you are able to use api from frontend

const corsOptions = {
  origin: "http://localhost:3006", // Replace with your frontend's origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: false, // Enable credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOptions)); // Add cors with cors configs to app
app.use("/", routes); // Add routes to app

// Bring up app
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
