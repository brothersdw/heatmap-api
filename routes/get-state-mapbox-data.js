const express = require("express");
const router = express.Router();
const getStateMapboxData = require("../api/get-state-mapbox-data"); // Import function to get mapbox data

router.get("/", getStateMapboxData); // Set to post at "/" (this route is changed to the correct route in index.js) and invoke function

module.exports = router;
