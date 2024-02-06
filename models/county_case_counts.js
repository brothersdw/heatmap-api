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

// Select all columns and rows from county_case_counts table for current day

const date = new Date();
const dateToISOString = new Date(date.setDate(date.getDate())).toISOString();
const currentDayStart = dateToISOString.split("T")[0] + "T" + "00:00:00.000Z";
const currentDayEnd = dateToISOString.split("T")[0] + "T" + "23:59:50.000Z";

County_case_counts.getCountyCaseCountsDefault = () =>
  knex
    .select("*")
    .from("county_case_counts")
    .whereBetween("created_at", [currentDayStart, currentDayEnd]);

County_case_counts.getCountyCaseCountsById = (id) =>
  knex.select("*").from("county_case_counts").where({ id: id });

// Select all columns and rows from county_case_counts table for specified date range
County_case_counts.getCountyCaseCountsByDate = (date1, date2) =>
  knex
    .select("*")
    .from("county_case_counts")
    .whereBetween("created_at", [date1, date2]);

County_case_counts.insertCountyCaseCounts = (case_count_object) =>
  knex("county_case_counts").insert(case_count_object);

module.exports = County_case_counts;
