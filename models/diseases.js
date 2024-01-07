const { randomUUID } = require("crypto");
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

const diseaseFields = [
  {
    id: randomUUID(),
    disease_cases_key: "test_disease_1",
    disease_description: "Test Disease 1",
  },
  {
    id: randomUUID(),
    disease_cases_key: "test_disease_2",
    disease_description: "Test Disease 2",
  },
  {
    id: randomUUID(),
    disease_cases_key: "test_disease_3",
    disease_description: "Test Disease 3",
  },
  {
    id: randomUUID(),
    disease_cases_key: "test_disease_4",
    disease_description: "Test Disease 4",
  },
  {
    id: randomUUID(),
    disease_cases_key: "test_disease_5",
    disease_description: "Test Disease 5",
  },
];
Diseases.insertTestDiseases = () => knex("diseases").insert(diseaseFields);

module.exports = Diseases;
