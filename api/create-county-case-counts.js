const { randomUUID } = require("crypto");
const floridaCoordinates = require("../data/county-boundaries.json"); // Import data from county-boundaries.json file
const diseaseModel = require("../models/diseases"); // Import diseases model
const countyCaseCountsModel = require("../models/county_case_counts");
const randomNum = () => Math.floor(Math.random() * (200000 - 0 + 1)) + 0; // to simulate counts from Integration

// Async function that builds data in the structure that mapbox expects
const createCountyCaseCounts = async (req, res) => {
  try {
    const countyCases = await countyCaseCountsModel.getCountyCaseCounts();
    if (countyCases.length > 0) {
      console.log(
        "Test county case counts already exist in the county_case_counts table."
      );
      return res.status(200).send({
        message:
          "Test county cases already exist in the county_case_counts table.",
      });
    }
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
    // const filteredDiseaseCases = county_case_counts.filter((c) => Object);
    const case_count_object = county_case_counts.map((c) => {
      return {
        id: randomUUID(),
        county: c.county,
        incidences: JSON.stringify(
          Object.keys(c)
            .filter((ck) => ck !== "county")
            .map((oc) => {
              return {
                [oc]: randomNum(),
              };
            })
        ),
      };
    });
    countyCaseCountsModel
      .insertCountyCaseCounts(case_count_object)
      .then((result) => result)
      .catch((err) => {
        console.log(
          "Something went wrong attempting to insert into county_case_counts table in create-county-case-counts.js:",
          err
        );
      });
    return res.status(200).send({
      message:
        "Successfully created county case counts in create-county-case-counts.js",
      case_count_object,
    }); // Send a status of 200 OK and county counts

    // If an error should occur log and send message with error
  } catch (err) {
    console.log(
      "Something went wrong creating county case counts in create-county-case-counts.js: ",
      err
    );
    return res.status(500).send({
      message: "Something went wrong creating county case counts.",
      error: err.message,
    });
  }
};

module.exports = createCountyCaseCounts;
