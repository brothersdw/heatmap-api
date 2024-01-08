"use strict";

exports.up = (knex) =>
  knex.schema.hasTable("county_case_counts").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("county_case_counts", function (table) {
        table.string("id", 255).notNullable().unique();
        table.string("county", 5000);
        table.string("incidences", 10000);
      });
    }
  });

exports.down = (knex) => knex.schema.dropTable("county_case_counts");
