// const stateCoordinates = require("../data/state-boundaries.json"); // Import data from county-boundaries.json file
const stateCoordinates = require("../data/us-state-boundaries.json"); // Import data from county-boundaries.json file
const diseaseModel = require("../models/diseases"); // Import diseases model
const randomNum = () => Math.floor(Math.random() * (200000 - 0 + 1)) + 0; // to simulate counts from Integration
const countyCaseCountsModel = require("../models/county_case_counts");

// Async function that builds data in the structure that mapbox expects
const buildStateMapBoxData = async (req, res) => {
  try {
    const state = String(req.query.state).toUpperCase();
    const diseases = await diseaseModel.getDiseases(); // Await database query for diseases
    const stateLevelCaseCounts = await countyCaseCountsModel
      .getCountyCaseCountsDefault(state)
      .then((result) => {
        const disease_keys = [];
        result.map((r) =>
          JSON.parse(r.incidences).map((i) => {
            let keyExists = false;
            let setIdx;

            disease_keys.map((dk, idx) => {
              if (Object.keys(i)[0] === Object.keys(dk)[0]) {
                keyExists = true;
                setIdx = `${idx}`;
              }
            });

            if (!keyExists) {
              return disease_keys.push({
                [Object.keys(i)]: Object.values(i)[0],
              });
            } else {
              disease_keys[setIdx][Object.keys(i)[0]] =
                disease_keys[setIdx][Object.keys(i)[0]] + Object.values(i)[0];
            }
          })
        );
        return disease_keys;
      })
      .catch((err) => {
        console.log(
          "Something went wrong attempting to gather state leve case counts in get-state-mapbox-data.js:",
          err
        );
      });
    const features =
      stateLevelCaseCounts.length > 0
        ? stateCoordinates
            .filter((sc) => sc.stusab === state)
            .map((s, idx) => {
              // For each set of coordinate arrays grab value of disease cases key for key, add random number as value
              // and add county to properties object
              const properties = diseases.reduce(
                (arr, field) => ({
                  ...arr,
                  [field.disease_cases_key]: Object.values(
                    stateLevelCaseCounts.filter(
                      (s) => Object.keys(s)[0] === field.disease_cases_key
                    )[0]
                  )[0],
                  state: s.name,
                  state_ab: s.stusab,
                  isState: true,
                }),
                {}
              );
              const stateObj = {
                type: s.st_asgeojson.geometry.type,
                geometry: {
                  coordinates: s.st_asgeojson.geometry.coordinates,
                  type: s.st_asgeojson.geometry.type,
                },
              };
              // Create object with all aggregated data
              const gatherMaboxData = {
                type: "Feature",
                properties: properties,
                geometry: {
                  type: stateObj.type,
                  coordinates: stateObj.geometry.coordinates,
                },
              };
              return gatherMaboxData;
            })
        : stateCoordinates.map((s, idx) => {
            // idx === 0 && console.log("current state in state mapbox data:", s);
            // For each set of coordinate arrays grab value of disease cases key for key, add random number as value
            // and add county to properties object
            const properties = {
              state: s.name,
              state_ab: s.stusab,
              isState: true,
            };
            const stateObj = {
              type: s.st_asgeojson.geometry.type,
              geometry: {
                coordinates: s.st_asgeojson.geometry.coordinates,
                type: s.st_asgeojson.geometry.type,
              },
            };
            // Create object with all aggregated data
            const gatherMaboxData = {
              type: "Feature",
              properties: properties,
              geometry: {
                type: stateObj.type,
                coordinates: stateObj.geometry.coordinates,
              },
            };
            return gatherMaboxData;
          });
    // Create Feature Collection for mapbox to injest
    const mapboxData = {
      type: "FeatureCollection",
      features,
    };
    return res.status(200).send(mapboxData); // Send a status of 200 OK and mapbox data

    // If an error should occur log and send message with error
  } catch (err) {
    console.log(
      "Something went wrong when trying to build state mapbox data: ",
      err
    );
    return res.status(500).send({
      message: `Something went wrong when trying to build state mapbox data: ${err}`,
    });
  }
};

module.exports = buildStateMapBoxData;
