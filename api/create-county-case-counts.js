const floridaCoordinates = require("../data/county-boundaries.json"); // Import data from county-boundaries.json file
const diseaseModel = require("../models/diseases"); // Import diseases model
const randomNum = () => Math.floor(Math.random() * (200000 - 0 + 1)) + 0; // to simulate counts from Integration

// Async function that builds data in the structure that mapbox expects
const createCountyCaseCounts = async (req, res) => {
  try {
    const diseases = await diseaseModel.getDiseases(); // Await database query for diseases
    const county_case_counts = floridaCoordinates.map((c) => {
      const aggregateData = diseases.reduce(
        (arr, field) => ({
          ...arr,
          [field.disease_cases_key]: randomNum(),
          county: c.county,
        }),
        {}
      );
      return aggregateData;
    });
    return res.status(200).send(county_case_counts); // Send a status of 200 OK and county counts

    // If an error should occur log and send message with error
  } catch (err) {
    console.log("Something went wrong creating county case counts: ", err);
    return res.status(500).send({
      message: `Something went wrong creating county case counts: ${err}`,
    });
  }
};

module.exports = createCountyCaseCounts;
