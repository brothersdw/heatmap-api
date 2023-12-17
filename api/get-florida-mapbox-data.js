const floridaCoordinates = require("../data/county-boundaries.json");
const diseaseModel = require("../models/diseases");
const randomNum = () => Math.floor(Math.random() * (200000 - 0 + 1)) + 0; // to simulate counts from Integration

const buildMapBoxData = async (req, res) => {
  try {
    const diseases = await diseaseModel.getDiseases();
    const features = floridaCoordinates.map((c) => {
      console.log("county: ", c.county);
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
