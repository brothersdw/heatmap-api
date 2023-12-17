const express = require("express");
const router = express.Router();
const updateCoordinates = require("../api/udpdate-florida-coordinates");

router.get("/", updateCoordinates);

module.exports = router;
