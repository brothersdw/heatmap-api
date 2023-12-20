const express = require("express");
const router = express.Router();
// Import all routers from routes
const updateFloridaCoordinates = require("./update-florida-county-coordinates");
const getDiseases = require("./get-diseases");
const getFloridaCoordinates = require("./get-florida-county-coordinates");
const getFloridaMapboxData = require("./get-florida-mapbox-data");
const buildFLGeoJsonData = require("./build-florida-geojson-data");

// Set routes
router.use("/update-florida-county-coordinates", updateFloridaCoordinates);
router.use("/get-florida-county-coordinates", getFloridaCoordinates);
router.use("/get-diseases", getDiseases);
router.use("/get-florida-mapbox-data", getFloridaMapboxData);
router.use("/build-florida-geojson", buildFLGeoJsonData);

module.exports = router;
