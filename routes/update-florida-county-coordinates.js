const express = require("express");
const router = express.Router();
const updateCoordinates = require("../api/udpdate-florida-coordinates");

router.post("/", updateCoordinates);

module.exports = router;
