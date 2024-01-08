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

// const diseaseFields = [
//   {
//     id: randomUUID(),
//     disease_cases_key: "test_disease_1",
//     disease_description: "Test Disease 1",
//   },
//   {
//     id: randomUUID(),
//     disease_cases_key: "test_disease_2",
//     disease_description: "Test Disease 2",
//   },
//   {
//     id: randomUUID(),
//     disease_cases_key: "test_disease_3",
//     disease_description: "Test Disease 3",
//   },
//   {
//     id: randomUUID(),
//     disease_cases_key: "test_disease_4",
//     disease_description: "Test Disease 4",
//   },
//   {
//     id: randomUUID(),
//     disease_cases_key: "test_disease_5",
//     disease_description: "Test Disease 5",
//   },
// ];
County_case_counts.insertCountyCaseCounts = (case_count_object) =>
  knex("county_case_counts").insert(case_count_object);

module.exports = County_case_counts;
