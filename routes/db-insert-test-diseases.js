const express = require("express");
const router = express.Router();
const insertTestDiseases = require("../api/db-insert-test-diseases"); // Import function to update county-boundaries.json file

router.post("/", insertTestDiseases); // Set to post at "/" (this route is changed to the correct route in index.js) and invoke function

module.exports = router;
