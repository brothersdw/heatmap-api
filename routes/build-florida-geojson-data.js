const express = require("express");
const router = express.Router();
const buildFLGeoJsonData = require("../api/build-florida-geojson");

router.post("/", buildFLGeoJsonData);

module.exports = router;
