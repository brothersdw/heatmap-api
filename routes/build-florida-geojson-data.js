const express = require("express");
const router = express.Router();
const buildFLGeoJsonData = require("../api/build-florida-geojson"); // Import geojson build function

router.post("/", buildFLGeoJsonData); // Set to POST at "/" (this route is changed to the correct route in index.js) and invoke function

module.exports = router;
