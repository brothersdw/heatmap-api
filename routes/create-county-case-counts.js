const express = require("express");
const router = express.Router();
const createCountyCaseCounts = require("../api/create-county-case-counts"); // Import createCountyCaseCounts function

router.post("/", createCountyCaseCounts); // This is used by app.js

module.exports = router;
