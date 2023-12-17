const diseases = require("../models/diseases");

const fetchDiseases = async (req, res) => {
  try {
    const allDiseases = await diseases.getDiseases();
    res.status(200).json(allDiseases);
  } catch (err) {
    console.log("Something went wrong when fetching diseases: ", err);
    res.status(500).send({
      message: `Something went wrong when fetching diseases ${err}`,
    });
  }
};

module.exports = fetchDiseases;
