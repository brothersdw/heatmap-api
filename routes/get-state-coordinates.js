const express = require("express");
const router = express.Router();
const getCoordinates = require("../api/get-state-coordinates"); // Import function to get coordinates from county-boundaries.json file

router.get("/", getCoordinates); // Set to post at "/" (this route is changed to the correct route in index.js) and invoke function

module.exports = router;
