const express = require("express");
const router = express.Router();
const getCoordinates = require("../api/get-florida-county-coordinates");

router.get("/", getCoordinates);

module.exports = router;
