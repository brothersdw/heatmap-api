const express = require("express");
const router = express.Router();
const getFloridaMapboxData = require("../api/get-florida-mapbox-data");

router.get("/", getFloridaMapboxData);

module.exports = router;
