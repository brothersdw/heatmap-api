const bookshelf = require("../config/bookshelf"); // Import bookshelf for models and knex
const { knex } = bookshelf; // Grab knex from bookshelf

// Create model from table
const Disease = bookshelf.Model.extend({
  tableName: "disease",
});

// Create collection from model
const Diseases = bookshelf.Collection.extend({
  model: Disease,
});

// Select all columns and rows from diseases table
Diseases.getDiseases = () => knex.select("*").from("diseases");

module.exports = Diseases;
