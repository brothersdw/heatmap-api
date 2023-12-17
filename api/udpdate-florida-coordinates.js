const axios = require("axios");
const uuid = require("uuid").v4;
const apikey = require("../keys/openCageDataKeys.json").apiKey;
const fs = require("fs");
const { stringify } = require("querystring");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const updateCoordinates = async (req, res) => {
  try {
    const response = await axios.get(
      "https://public.opendatasoft.com//api/explore/v2.1/catalog/datasets/us-county-boundaries/records?select=geo_shape%2C%20namelsad&where=stusab%20%3D%20'FL'&limit=67"
    );
    const coordinates = [];
    console.log("Made it here", response);
    await response.data.results.forEach((result, idx) => {
      const countyBoundary = result.geo_shape;
      let countyId = uuid();
      let idExists = coordinates.filter((ids) => ids.id === countyId);
      while (idExists.length > 0) {
        countyId = uuid();
        idExists = coordinates.filter((ids) => ids.id === countyId);
        console.log(`There was an existing id ${countyId}`);
      }
      console.log(
        "coordinates: ",
        result.geo_shape.geometry.coordinates.length > 1
      );
      coordinates.push({
        id: countyId,
        county: result.namelsad,
        geometry: JSON.stringify(result.geo_shape.geometry.coordinates),
        type: result.geo_shape.geometry.type,
      });
    });
    coordinatesString = JSON.stringify(coordinates);
    const jsonFilePath = "./data/county-boundaries.json";
    console.log("Your stringified coordinates: ", coordinates);
    fs.writeFile(jsonFilePath, JSON.stringify(coordinates), (err) => {
      if (err) {
        console.log(
          `There was an issue writing the JSON file for coordinates to ${jsonFilePath}: ${err}`
        );
      } else {
        console.log(`JSON file successfully written to ${jsonFilePath}`);
      }
    });
    res.status(200).send({
      message: "Sucessfully got coordinates",
    });
  } catch (e) {
    console.log(`Error fetching coordinates: ${e}`);
    return res.status(500).send("There was a problem fetching coordinates");
  }
};

module.exports = updateCoordinates;
