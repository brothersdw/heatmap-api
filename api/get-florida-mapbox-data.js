const { randomUUID } = require("crypto");
// const floridaCoordinates = require("../data/county-boundaries.json"); // Import data from county-boundaries.json file
const floridaCoordinates = require("../data/us-county-boundaries.json"); // Import data from county-boundaries.json file
const diseaseModel = require("../models/diseases"); // Import diseases model
const countyCaseCountsModel = require("../models/county_case_counts");
const randomNum = (range1, range2) =>
  Math.floor(Math.random() * (range2 - range1 + 1)) + range1; // to simulate counts from Integration

// Async function that builds data in the structure that mapbox expects
// let genPopulationTotal = 0;
const buildMapBoxData = async (req, res) => {
  try {
    const usState = String(req.query.state).toUpperCase();
    const diseases = await diseaseModel.getDiseases(); // Await database query for diseases
    let countyCaseCounts;
    /******************Uncomment this block in prod************************/
    // const countyCaseCounts = // Only commented out during testing
    //   req.query.date1 && req.query.date2
    //     ? await countyCaseCountsModel.getCountyCaseCountsByDate(
    //         usState,
    //         req.query.date1,
    //         req.query.date2
    //       )
    //     : req.query.date1 && !req.query.date2
    //     ? await countyCaseCountsModel.getCountyCaseCountsByDate(
    //         usState,
    //         req.query.date1 + " 00:00:00",
    //         req.query.date1 + " 23:59:59"
    //       )
    //     : await countyCaseCountsModel.getCountyCaseCountsDefault(usState);

    /**************Important this is only a TESTING block remove below in brackets for prod*********************/
    // Strictly for testing this block will be removed in prod this is a temp solution
    // to make sure there are rows for the day that is selected {
    let checkCaseCounts;
    if (req.query.date1) {
      const date1 = req.query.date1 + " 00:00:00";
      const date2 = req.query.date1 + " 23:59:59";
      checkCaseCounts = await countyCaseCountsModel.getCountyCaseCountsByDate(
        usState,
        date1,
        date2
      );
    } else {
      checkCaseCounts = await countyCaseCountsModel.getCountyCaseCountsDefault(
        usState
      );
    }
    if (checkCaseCounts.length > 0) {
      countyCaseCounts =
        req.query.date1 && req.query.date2
          ? await countyCaseCountsModel.getCountyCaseCountsByDate(
              usState,
              req.query.date1,
              req.query.date2
            )
          : req.query.date1 && !req.query.date2
          ? await countyCaseCountsModel.getCountyCaseCountsByDate(
              usState,
              req.query.date1 + " 00:00:00",
              req.query.date1 + " 23:59:59"
            )
          : await countyCaseCountsModel.getCountyCaseCountsDefault(usState);
    } else {
      const aggregateData = [];
      floridaCoordinates.map((c) => {
        const date = new Date();
        let day;
        if (req.query.date1) {
          day = req.query.date1 + " " + "01:00:00";
        } else {
          day =
            new Date(date.setDate(date.getDate())).toISOString().split("T")[0] +
            " " +
            new Date(date.setDate(date.getDate()))
              .toISOString()
              .split("T")[1]
              .split(".")[0];
        }
        const countyData = diseases.reduce(
          (arr, field) => ({
            ...arr,
            created_at: day,
            updated_at: day,
            [field.disease_cases_key]: randomNum(0, 200000),
            state: c.state,
            state_ab: c.state_ab,
            county: c.county,
          }),
          {}
        );
        aggregateData.push(countyData);
      });
      let randomId = randomUUID();
      let idExists = await countyCaseCountsModel.getCountyCaseCountsById(
        randomId
      );
      while (idExists.length > 0) {
        randomId = randomUUID();
        idExists = await countyCaseCountsModel.getCountyCaseCountsById(
          randomId
        );
      }
      const case_count_object = aggregateData.map((c) => {
        return {
          id: randomUUID(),
          created_at: c.created_at,
          updated_at: c.updated_at,
          state: c.state,
          state_ab: c.state_ab,
          county: c.county,
          incidences: JSON.stringify(
            Object.keys(c)
              .filter(
                (ck) =>
                  ck !== "county" &&
                  ck !== "created_at" &&
                  ck !== "updated_at" &&
                  ck !== "state" &&
                  ck !== "state_ab"
              )
              .map((oc) => {
                const numOfCases = randomNum(0, 200000);
                return {
                  [oc]: numOfCases,
                };
              })
          ),
        };
      });
      await countyCaseCountsModel.insertCountyCaseCounts(case_count_object);
      countyCaseCounts =
        req.query.date1 && req.query.date2
          ? await countyCaseCountsModel.getCountyCaseCountsByDate(
              req.query.date1,
              req.query.date2
            )
          : req.query.date1 && !req.query.date2
          ? await countyCaseCountsModel.getCountyCaseCountsByDate(
              req.query.date1 + " 00:00:00",
              req.query.date1 + " 23:59:59"
            )
          : await countyCaseCountsModel.getCountyCaseCountsDefault();
    }
    // } End of block to remove for prod

    const features = floridaCoordinates
      .filter((fc) => fc.state_ab === usState)
      .map((c) => {
        // For each set of coordinate arrays grab value of disease cases key for key, add random number as value
        // and add county to properties object
        const properties = diseases.reduce((arr, field) => {
          const generalPopulation = randomNum(200000, 500000);
          const date = countyCaseCounts
            .filter((cc) => c.county === cc.county)[0]
            .created_at.toISOString()
            .split("T")[0];
          return {
            ...arr,
            // [field.disease_cases_key]: randomNum(),
            [field.disease_cases_key]: Object.values(
              JSON.parse(
                // Get all incidences for county
                countyCaseCounts.filter((cc) => c.county === cc.county)[0]
                  .incidences
                // Filter through incidences to return value where the object key matches the current field.disease_cases_key
              ).filter((ok) => {
                if (Object.keys(ok)[0] === field.disease_cases_key)
                  return Object.values(ok)[0];
              })[0]
            )[0], // Simulates data from integration
            created_at: date,
            state: c.state,
            state_ab: c.state_ab,
            county: c.county,
            isCounty: true,
            genPopulation: generalPopulation,
            [field.disease_cases_key + "_cases_percentage"]:
              (Object.values(
                JSON.parse(
                  // Get all incidences for county
                  countyCaseCounts.filter((cc) => c.county === cc.county)[0]
                    .incidences
                  // Filter through incidences to return value where the object key matches the current field.disease_cases_key
                ).filter((ok) => {
                  if (Object.keys(ok)[0] === field.disease_cases_key)
                    return Object.values(ok)[0];
                })[0]
              )[0] /
                generalPopulation) *
              100,
          };
        }, {});
        // Create object with all aggregated data
        const gatherMaboxData = {
          type: "Feature",
          properties: properties,
          geometry: {
            type: c.type,
            coordinates: JSON.parse(c.geometry),
          },
        };
        return gatherMaboxData;
      });
    // Create Feature Collection for mapbox to injest
    const mapboxData = {
      type: "FeatureCollection",
      features,
    };
    return res.status(200).send(mapboxData); // Send a status of 200 OK and mapbox data

    // If an error should occur log and send message with error
  } catch (err) {
    console.log("Something went wrong when trying to build mapbox data: ", err);
    return res.status(500).send({
      message: `Something went wrong when trying to build mapbox data: ${err}`,
    });
  }
};

module.exports = buildMapBoxData;
