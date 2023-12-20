const express = require("express");
const router = express.Router();
const getFloridaMapboxData = require("../api/get-florida-mapbox-data"); // Import function to get mapbox data

router.get("/", getFloridaMapboxData); // Set to post at "/" (this route is changed to the correct route in index.js) and invoke function

module.exports = router;
