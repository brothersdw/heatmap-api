const coordinates = require("../data/state-boundaries.json"); // Import data from county-boundaries.json

// Async function to fetch coordinates from the county-boundaries.json file
const fetchCoordinates = async (req, res) => {
  try {
    return res.status(200).json(coordinates); // Return 200 OK status and send the array of coordinates

    // If any error should occur log and send message with error
  } catch (error) {
    console.log("Something went wrong when fetching diseases: ", error);
    return res
      .status(400)
      .send(`Something went wrong when fetching diseases: ${error}`);
  }
};

module.exports = fetchCoordinates;
