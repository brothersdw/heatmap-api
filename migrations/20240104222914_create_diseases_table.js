"use strict";

exports.up = (knex) =>
  knex.schema.hasTable("diseases").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("diseases", function (table) {
        table.string("id", 255).notNullable().unique();
        table.string("disease_cases_key", 1000);
        table.string("disease_description", 5000);
      });
    }
  });

exports.down = (knex) => knex.schema.dropTable("diseases");
