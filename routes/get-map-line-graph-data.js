const express = require("express");
const router = express.Router();
const getLineGraphData = require("../api/get-map-line-graph-data"); // Import function to fetch disease

router.get("/", getLineGraphData); // Set to GET at "/" (this route is changed to the correct route in index.js) and invoke function

module.exports = router;
