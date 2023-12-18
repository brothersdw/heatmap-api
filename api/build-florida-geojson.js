const fs = require("fs");
const floridaCoordinates = require("../data/county-boundaries.json");
const diseaseModel = require("../models/diseases");

function fixPolygonOrientation(polygon) {
  if (!Array.isArray(polygon)) {
    // Handle the case where polygon is not an array
    console.error("Input is not a valid polygon array.");
    return polygon;
  }

  const area = polygon.reduce((acc, [x, y], i, arr) => {
    const next = arr[(i + 1) % arr.length];
    return acc + (next[0] - x) * (next[1] + y);
  }, 0);

  if (area < 0) {
    // Polygon is clockwise, reverse the order
    polygon.reverse();
  }

  return polygon;
}
const buildFLGeoJsonData = async (req, res) => {
  try {
    const features = floridaCoordinates.map((c) => {
      console.log("county: ", c.county);
      const properties = {
        county: c.county,
      };
      console.log("geometry: ", c.geometry);
      const flCoordinates = [[fixPolygonOrientation(c.geometry)]];
      console.log("florid coordinates: ", flCoordinates);
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
    const geoJSONData = {
      type: "FeatureCollection",
      features,
    };
    const jsonFilePath = "./data/florida-county-boundaries.geojson";
    // console.log("Your stringified coordinates: ", coordinates);
    fs.writeFile(jsonFilePath, JSON.stringify(geoJSONData), (err) => {
      if (err) {
        console.log(
          `There was an issue writing the GEOJSON file for coordinates to ${jsonFilePath}: ${err}`
        );
      } else {
        console.log(`GEOJSON file successfully written to ${jsonFilePath}`);
      }
    });
    return res.status(200).send({
      message: `geoJSON for Florida successfully build in ${jsonFilePath}`,
    });
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
