const express = require("express");
const router = express.Router();
const getDiseases = require("../api/get-diseases");

router.get("/", getDiseases);

module.exports = router;
