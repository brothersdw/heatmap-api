const floridaCoordinates = require("../data/county-boundaries.json"); // Import data from county-boundaries.json file
const diseaseModel = require("../models/diseases"); // Import diseases model
const countyCaseCountsModel = require("../models/county_case_counts");
const randomNum = () => Math.floor(Math.random() * (200000 - 0 + 1)) + 0; // to simulate counts from Integration

// Async function that builds data in the structure that mapbox expects
const buildMapBoxData = async (req, res) => {
  try {
    const diseases = await diseaseModel.getDiseases(); // Await database query for diseases
    const countyCaseCounts = await countyCaseCountsModel.getCountyCaseCounts();
    const features = floridaCoordinates.map((c) => {
      // For each set of coordinate arrays grab value of disease cases key for key, add random number as value
      // and add county to properties object
      const properties = diseases.reduce(
        (arr, field) => ({
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
          )[0],
          county: c.county,
        }),
        {}
      );
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
