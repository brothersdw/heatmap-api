const { randomUUID } = require("crypto");
const { exec } = require("child_process");
const floridaCoordinates = require("../data/county-boundaries.json"); // Import data from county-boundaries.json file
const usCountyBoundaries = require("../data/us-county-boundaries.json"); // Import data from county-boundaries.json file
const diseaseModel = require("../models/diseases"); // Import diseases model
const countyCaseCountsModel = require("../models/county_case_counts");
const randomNum = () => Math.floor(Math.random() * (200000 - 0 + 1)) + 0; // to simulate counts from Integration
const randomPer = () => Math.floor(Math.random() * (0.8 - 0 + 1)) + 0.1;

// Async function that inserts a years worth of dummy data for every county in every state of the US
const createCountyCaseCounts = async (req, res) => {
  try {
    const countyCases = await countyCaseCountsModel.getCountyCaseCountsDefault(
      "FL"
    );
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
    usCountyBoundaries.map(async (c, idx) => {
      for (let i = 0; i < 365; i++) {
        let consoleCount = 1;
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
            state: c.state,
            state_ab: c.state_ab,
            county: c.county,
          }),
          {}
        );
        const case_count_object = {
          id: randomUUID(),
          created_at: countyData.created_at,
          updated_at: countyData.updated_at,
          state: countyData.state,
          state_ab: countyData.state_ab,
          county: countyData.county,
          incidences: JSON.stringify(
            Object.keys(countyData)
              .filter(
                (ck) =>
                  ck !== "county" &&
                  ck !== "created_at" &&
                  ck !== "updated_at" &&
                  ck !== "state" &&
                  ck !== "state_ab"
              )
              .map((oc) => {
                const numOfCases = randomNum();
                return {
                  [oc]: numOfCases,
                };
              })
          ),
        };
        await countyCaseCountsModel
          .insertCountyCaseCounts(case_count_object)
          .then()
          .catch((err) => {
            console.log(
              "Something went wrong attempting to insert into county_case_counts table in create-county-case-counts.js:",
              err
            );
          });

        console.log(
          `Database build progress: ${((i / 365) * 100).toFixed(2)}%`
        );
      }
    });
    return res.status(200).send({
      message:
        "Successfully created county case counts in create-county-case-counts.js",
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
