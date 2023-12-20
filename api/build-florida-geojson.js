const fs = require("fs"); // Import fs to write file
const floridaCoordinates = require("../data/county-boundaries.json"); // Import data from county-boundaries.json

// This function ensures coordinates for each county are arranged correctly according to geoJSO standards
function fixPolygonOrientation(polygon) {
  if (!Array.isArray(polygon)) {
    // Handle the case where polygon is not an array
    console.error("Input is not a valid polygon array.");
    return polygon;
  }

  // Get the area of all coordinates
  const area = polygon.reduce((acc, [x, y], i, arr) => {
    const next = arr[(i + 1) % arr.length];
    return acc + (next[0] - x) * (next[1] + y);
  }, 0);

  // If area is less than zero polygon is clockwise, reverse the order
  if (area < 0) {
    polygon.reverse();
  }

  return polygon;
}

// Builds geoJSON file
const buildFLGeoJsonData = async (req, res) => {
  try {
    // Build objects in features array from county-coordinates.json
    const features = floridaCoordinates.map((c) => {
      console.log("county: ", c.county);
      // Add properties
      const properties = {
        county: c.county,
      };
      // Create flCoordinates array after fixing orientation of coordinates
      const flCoordinates = [[fixPolygonOrientation(c.geometry)]];
      // Create gathergeoJSON Object
      const gathergeoJSONData = {
        type: "Feature",
        properties: properties,
        color: "white",
        geometry: {
          type: c.type,
          coordinates: JSON.parse(flCoordinates),
        },
      };
      return gathergeoJSONData;
    });
    // Create geoJSONData object
    const geoJSONData = {
      type: "FeatureCollection",
      features,
    };
    const jsonFilePath = "./data/florida-county-boundaries.geojson";
    // Write file to jsonFilePath
    fs.writeFile(jsonFilePath, JSON.stringify(geoJSONData), (err) => {
      // If an error exists log out message with error
      if (err) {
        console.log(
          `There was an issue writing the GEOJSON file for coordinates to ${jsonFilePath}: ${err}`
        );
        // Else log out that file was successfully written to the specified path
      } else {
        console.log(`GEOJSON file successfully written to ${jsonFilePath}`);
      }
    });
    // Return 200 OK status and send message that the geoJSON was successfully built to the specified path
    return res.status(200).send({
      message: `geoJSON for Florida successfully built in ${jsonFilePath}`,
    });
    // If any error should occur log and send message along with error
  } catch (err) {
    console.log(
      "Something went wrong when trying to build geoJSON file: ",
      err
    );
    return res.status(500).send({
      message: `Something went wrong when trying to build geoJSON file: ${err}`,
    });
  }
};

module.exports = buildFLGeoJsonData;
