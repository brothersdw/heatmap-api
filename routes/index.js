const express = require("express");
const router = express.Router();
// Import all routers from routes
const updateFloridaCoordinates = require("./update-florida-county-coordinates");
const updateStateCoordinates = require("./update-state-coordinates");
const getDiseases = require("./get-diseases");
const getFloridaCoordinates = require("./get-florida-county-coordinates");
const getFloridaMapboxData = require("./get-florida-mapbox-data");
const buildFLGeoJsonData = require("./build-florida-geojson-data");
const createCountyCaseCounts = require("./create-county-case-counts");
const getStateCoordinates = require("./get-state-coordinates");
const getStateMapboxData = require("./get-state-mapbox-data");

// Set routes
router.use("/update-florida-county-coordinates", updateFloridaCoordinates);
router.use("/update-state-coordinates", updateStateCoordinates);
router.use("/create-county-case-counts", createCountyCaseCounts);
router.use("/get-florida-county-coordinates", getFloridaCoordinates);
router.use("/get-state-coordinates", getStateCoordinates);
router.use("/get-diseases", getDiseases);
router.use("/get-state-mapbox-data", getStateMapboxData);
router.use("/get-florida-mapbox-data", getFloridaMapboxData);
router.use("/build-florida-geojson", buildFLGeoJsonData);

module.exports = router;
