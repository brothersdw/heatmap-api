const countyDataModel = require("../models/county_case_counts");
const getGraphData = async (req, res) => {
  const state = String(req.query.state).toUpperCase();
  const startDate = req.query.startDate;
  const date = new Date();
  const endDate =
    new Date(date.setDate(date.getDate(req.query.endDate) + 1))
      .toISOString()
      .split("T")[0] +
    "T" +
    "23:59:59Z";
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
