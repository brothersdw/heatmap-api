const bookshelf = require("../config/bookshelf");
const { knex } = bookshelf;

const Disease = bookshelf.Model.extend({
  tableName: "disease",
});

const Diseases = bookshelf.Collection.extend({
  model: Disease,
});

Diseases.getDiseases = () => knex.select("*").from("diseases");

module.exports = Diseases;
