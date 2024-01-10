const axios = require("axios"); // Import axios for sending request
const uuid = require("uuid").v4; // Import uuid to create unique ids
const fs = require("fs"); // Import fs for writing file

// Async function to update state-boundaries.json file
const updateStateCoordinates = async (req, res) => {
  try {
    // Await GET request to opendatasoft to retrieve state boundaries
    const response = await axios.get(
      "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-state-boundaries/records?select=name%2C%20st_asgeojson&where=stusab%20%3D%20'FL'&limit=20"
    );
    const coordinates = []; // Array to store coordinates

    response.data.results.forEach((result, idx) => {
      let stateId = uuid(); // Create unique state id
      let idExists = coordinates.filter((ids) => ids.id === stateId); // Filter coordinates array to see if UUID exists

      // While idExists array length is more than 0 create a new UUID, check again and log that there was an existing id
      while (idExists.length > 0) {
        stateId = uuid();
        idExists = coordinates.filter((ids) => ids.id === stateId);
        console.log(`There was an existing id ${stateId}`);
      }

      // Create object for coordinates and push to coordinates array
      coordinates.push({
        id: stateId,
        state: result.name,
        geometry: JSON.stringify(result.st_asgeojson.geometry.coordinates),
        type: result.st_asgeojson.geometry.type,
      });
    });
    coordinatesString = JSON.stringify(coordinates); // Stringify coordinates
    const jsonFilePath = "./data/state-boundaries.json"; // File path to write to

    // Write file to specified path
    fs.writeFile(jsonFilePath, JSON.stringify(coordinates), (err) => {
      // If there is an error log message with file path and error
      if (err) {
        console.log(
          `There was an issue writing the state-boundaries JSON file for coordinates to ${jsonFilePath}: ${err}`
        );

        // Else log success message with specified path
      } else {
        console.log(
          `state-boundaries JSON file successfully written to ${jsonFilePath}`
        );
      }
    });
    console.log("File successfully created");
    // Send a 200 OK response with a success message
    res.status(200).send({
      message:
        "Sucessfully created state-boundaries JSON file for coordinates in data folder",
    });
    // If any error should occur log and send failure message along with error
  } catch (e) {
    console.log(
      "Error creating state-boundaries JSON file for coordinates: ",
      e
    );
    return res.status(500).send({
      message: `There was a problem creating state-boundaries JSON file for coordinates: ${e}`,
    });
  }
};

module.exports = updateStateCoordinates;
