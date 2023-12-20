const floridaCoordinates = require("../data/county-boundaries.json"); // Import data from county-boundaries.json file
const diseaseModel = require("../models/diseases"); // Import diseases model
const randomNum = () => Math.floor(Math.random() * (200000 - 0 + 1)) + 0; // to simulate counts from Integration

// This function builds data in the structure that mapbox expects
const buildMapBoxData = async (req, res) => {
  try {
    const diseases = await diseaseModel.getDiseases(); // Await database query for diseases
    const features = floridaCoordinates.map((c) => {
      console.log("county: ", c.county);
      // For each set of coordinate arrays grab value of disease cases key for key, add random number as value
      // and add county to properties object
      const properties = diseases.reduce(
        (arr, field) => ({
          ...arr,
          [field.disease_cases_key]: randomNum(),
          county: c.county,
        }),
        {}
      );
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
    const mapboxData = {
      type: "FeatureCollection",
      features,
    };
    return res.status(200).send(mapboxData);
  } catch (err) {
    console.log("Something went wrong when trying to build mapbox data: ", err);
    return res.status(500).send({
      message: `Something went wrong when trying to build mapbox data: ${err}`,
    });
  }
};

module.exports = buildMapBoxData;
