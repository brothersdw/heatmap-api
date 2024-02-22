const coordinates = require("../data/us-county-boundaries.json"); // Import data from county-boundaries.json

// Async function to fetch coordinates from the county-boundaries.json file
const fetchCoordinates = async (req, res) => {
  try {
    const state = req.query.state && String(req.query.state).toUpperCase();
    const selectedCoordinates = state
      ? coordinates.filter((c) => c.state_ab === state)
      : coordinates;
    return res.status(200).json(selectedCoordinates); // Return 200 OK status and send the array of coordinates

    // If any error should occur log and send message with error
  } catch (error) {
    console.log("Something went wrong when fetching diseases: ", error);
    return res
      .status(400)
      .send(`Something went wrong when fetching diseases: ${error}`);
  }
};

module.exports = fetchCoordinates;
