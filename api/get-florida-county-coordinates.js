const coordinates = require("../data/county-boundaries.json");

const fetchCoordinates = async (req, res) => {
  try {
    // const coordinatesParsed = JSON.parse(JSON.parse(coordinates));
    res.status(200).json(coordinates);
  } catch (error) {
    console.log("Something went wrong when fetching diseases: ", error);
  }
};

module.exports = fetchCoordinates;
