const diseases = require("../models/diseases"); // Import diseases model

// Async function to fetch diseases from the database
const fetchDiseases = async (req, res) => {
  try {
    // Await fetch from database
    const allDiseases = await diseases.getDiseases();
    return res.status(200).json(allDiseases); // Return a 200 OK status and an array of JSON objects
  } catch (err) {
    // If an error should occur log and send message with error.
    console.log("Something went wrong when fetching diseases: ", err);
    return res.status(500).send({
      message: `Something went wrong when fetching diseases ${err}`,
    });
  }
};

module.exports = fetchDiseases;
