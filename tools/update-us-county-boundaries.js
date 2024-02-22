const axios = require("axios"); // Import axios for sending request
const uuid = require("uuid").v4; // Import uuid to create unique ids
const fs = require("fs"); // Import fs for writing file
const { writeFile } = require("fs/promises");

// Async function to update county-boundaries.json file
const updateUSCountyBoundaries = async () => {
  try {
    // Await GET request to opendatasoft to retrieve county boundaries
    const response = await axios.get(
      "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-county-boundaries/exports/json?lang=en&timezone=America%2FNew_York"
    );
    // const response = await axios.get(
    //   "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-county-boundaries/records?select=geo_shape%2C%20namelsad&where=stusab%20%3D%20'FL'&limit=67"
    // );
    const coordinates = []; // Array to store coordinates

    response.data.forEach((result, idx) => {
      let countyId = uuid(); // Create unique county id
      let idExists = coordinates.filter((ids) => ids.id === countyId); // Filter coordinates array to see if UUID exists

      // While idExists array length is more than 0 create a new UUID, check again and log that there was an existing id
      while (idExists.length > 0) {
        countyId = uuid();
        idExists = coordinates.filter((ids) => ids.id === countyId);
        console.log(`There was an existing id ${countyId}`);
      }
      console.log("On count:", idx);
      // Create object for coordinates and push to coordinates array
      coordinates.push({
        id: countyId,
        state: result.state_name,
        state_ab: result.stusab,
        county: result.namelsad,
        geometry: JSON.stringify(result.geo_shape.geometry.coordinates),
        type: result.geo_shape.geometry.type,
      });
    });
    coordinatesString = JSON.stringify(coordinates); // Stringify coordinates
    const jsonFilePath = "./data/us-county-boundaries.json"; // File path to write to
    console.log(
      `The size of the coordinate string is: ${
        new Blob([coordinatesString]).size
      }`
    );
    // Write file to specified path
    fs.writeFile(jsonFilePath, JSON.stringify(coordinates), (err) => {
      // If there is an error log message with file path and error
      if (err) {
        console.log(
          `There was an issue writing the JSON file for coordinates to ${jsonFilePath}: ${err}`
        );

        // Else log success message with specified path
      } else {
        console.log(`JSON file successfully written to ${jsonFilePath}`);
      }
    });

    // Send a 200 OK response with a success message
    // If any error should occur log and send failure message along with error
  } catch (e) {
    console.log("Error fetching coordinates: ", e);
  }
};

updateUSCountyBoundaries();
