const { randomUUID } = require("crypto");
const floridaCoordinates = require("../data/county-boundaries.json"); // Import data from county-boundaries.json file
const diseaseModel = require("../models/diseases"); // Import diseases model
const countyCaseCountsModel = require("../models/county_case_counts");
const randomNum = () => Math.floor(Math.random() * (200000 - 0 + 1)) + 0; // to simulate counts from Integration
const randomPer = () => Math.floor(Math.random() * (0.8 - 0 + 1)) + 0.1;

// Async function that builds data in the structure that mapbox expects
const createCountyCaseCounts = async (req, res) => {
  try {
    const countyCases =
      await countyCaseCountsModel.getCountyCaseCountsDefault();
    if (countyCases.length > 0) {
      console.log(
        "Test county case counts already exist in the county_case_counts table.\n"
      );
      return res.status(200).send({
        message:
          "Test county cases already exist in the county_case_counts table.",
      });
    }
    const diseases = await diseaseModel.getDiseases(); // Await database query for diseases
    const aggregateData = [];
    floridaCoordinates.map((c) => {
      for (let i = 0; i < 365; i++) {
        const date = new Date();
        const day =
          new Date(date.setDate(date.getDate() - i))
            .toISOString()
            .split("T")[0] +
          " " +
          new Date(date.setDate(date.getDate() - i))
            .toISOString()
            .split("T")[1]
            .split(".")[0];
        const countyData = diseases.reduce(
          (arr, field) => ({
            ...arr,
            created_at: day,
            updated_at: day,
            [field.disease_cases_key]: randomNum(),
            county: c.county,
          }),
          {}
        );
        aggregateData.push(countyData);
      }
    });
    // const filteredDiseaseCases = county_case_counts.filter((c) => Object);
    const case_count_object = aggregateData.map((c) => {
      return {
        id: randomUUID(),
        created_at: c.created_at,
        updated_at: c.updated_at,
        county: c.county,
        incidences: JSON.stringify(
          Object.keys(c)
            .filter(
              (ck) =>
                ck !== "county" && ck !== "created_at" && ck !== "updated_at"
            )
            .map((oc) => {
              const numOfCases = randomNum();
              // const genPopSum = Math.round(
              //   randomPer() * numOfCases + numOfCases
              // );
              // const genPopPer = Math.round(numOfCases / genPopSum) * 100;
              return {
                [oc]: numOfCases,
                // generalPopPercentage: genPopPer,
                // generalPopulation: genPopSum,
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
