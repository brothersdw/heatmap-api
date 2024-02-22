const countyDataModel = require("../models/county_case_counts");
const getGraphData = async (req, res) => {
  const state = String(req.query.state).toUpperCase();
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const countyData = await countyDataModel.getCountyCaseCountsByDate(
    state,
    startDate,
    endDate
  );
  countyData.sort((a, b) => {
    return b.created_at.toISOString().split("T")[0] >
      a.created_at.toISOString().split("T")[0]
      ? -1
      : b.created_at.toISOString().split("T")[0] <
        a.created_at.toISOString().split("T")[0]
      ? 1
      : 0;
  });
  //   countyData.map((c) => {
  //     console.log(c.created_at.toISOString().split("T")[0]);
  //   });
  return res.status(200).send(countyData);
};

module.exports = getGraphData;
