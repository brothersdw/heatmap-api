const { randomUUID } = require("crypto");
const bookshelf = require("../config/bookshelf"); // Import bookshelf for models and knex
const { knex } = bookshelf; // Grab knex from bookshelf

// Create model from table
const County_case_count = bookshelf.Model.extend({
  tableName: "county_case_counts",
});

// Create collection from model
const County_case_counts = bookshelf.Collection.extend({
  model: County_case_count,
});

// Select all columns and rows from diseases table
County_case_counts.getCountyCaseCounts = () =>
  knex.select("*").from("county_case_counts");

County_case_counts.insertCountyCaseCounts = (case_count_object) =>
  knex("county_case_counts").insert(case_count_object);

module.exports = County_case_counts;
