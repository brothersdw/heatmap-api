const diseasesModel = require("../models/diseases");

const insertTestDiseases = async (req, res) => {
  try {
    const diseases = await diseasesModel.getDiseases();
    if (diseases.length > 0) {
      console.log("Test diseases already exist in the diseases table.");
      return res.status(200).send({
        message: "Test diseases already exist in the diseases table.",
      });
    }
    await diseasesModel
      .insertTestDiseases()
      .then((result) => {
        console.log(
          "Test diseases have successfully been added to the diseases table."
        );
        return res.status(200).send({
          message:
            "Test diseases have successfully been added to the diseases table.",
          result,
        });
      })
      .catch((err) => {
        console.log(
          "Something went wrong with inserting test diseases into the disease table in heatmap-api/api/db-insert-test-diseases.js:",
          err
        );
        return res.status(500).send({
          message:
            "Something went wrong with inserting test diseases into the disease table in heatmap-api/api/db-insert-test-diseases.js",
          error: err,
        });
      });
  } catch (err) {
    console.log(
      "Something went wrong in the try block while attempting to insert test diseases into the disease table in heatmap-api/api/db-insert-test-diseases.js:",
      err
    );
    return res.status(500).send({
      message:
        "Something went wrong in the try block while attempting to insert test diseases into the disease table in heatmap-api/api/db-insert-test-diseases.js:",
      error: err,
    });
  }
};

module.exports = insertTestDiseases;
