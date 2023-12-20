const express = require("express");
const router = express.Router();
const getDiseases = require("../api/get-diseases"); // Import function to fetch disease

router.get("/", getDiseases); // Set to GET at "/" (this route is changed to the correct route in index.js) and invoke function

module.exports = router;
