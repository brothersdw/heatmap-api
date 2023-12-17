const aws = require("aws-sdk");
const documentClient = new aws.DynamoDB.DocumentClient({ region: "us-east-1" });

const params = {
  TableName: "florida-county-boundaries",
  FilterExpression: "coordinates = :coordinates",
  ExpressionAttributeValues: { ":coordinates": {} },
  ProjectionExpression: "county, coordinates",
};
const query = async () => {
  const response = await documentClient.query(params).promise();
  console.log("response: ", response);
};

query().catch((err) => console.error(JSON.stringify(err, null, 2)));
