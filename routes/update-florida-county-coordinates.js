const express = require("express");
const router = express.Router();
const updateCoordinates = require("../api/udpdate-florida-coordinates"); // Import function to update county-boundaries.json file

router.post("/", updateCoordinates); // Set to post at "/" (this route is changed to the correct route in index.js) and invoke function

module.exports = router;
