const countyDataModel = require("../models/county_case_counts");
const getGraphData = async (req, res) => {
  const state = req.query.state.map((s) => String(s).toUpperCase());
  const startDate = req.query.startDate;
  const date = new Date();
  const endDate =
    new Date(date.setDate(date.getDate(req.query.endDate) + 1))
      .toISOString()
      .split("T")[0] +
    "T" +
    "23:59:59Z";
  const countyData = [];
  try {
    for (let i = 0; state.length > i; i++) {
      const currentCountyData = await countyDataModel.getCountyCaseCountsByDate(
        state[i],
        startDate,
        endDate
      );

      currentCountyData.sort((a, b) => {
        return b.created_at.toISOString().split("T")[0] >
          a.created_at.toISOString().split("T")[0]
          ? -1
          : b.created_at.toISOString().split("T")[0] <
            a.created_at.toISOString().split("T")[0]
          ? 1
          : 0;
      });
      countyData.push(currentCountyData);
    }
    //   countyData.map((c) => {
    //     console.log(c.created_at.toISOString().split("T")[0]);
    //   });
    return res.status(200).send(countyData);
  } catch (e) {
    console.log("Something went wrong when trying to retrieve graph data:", e);
    return res.status(500).send({
      Message: "Something went wrong when trying to retrieve graph data",
      "Error Message": e,
    });
  }
};

module.exports = getGraphData;
