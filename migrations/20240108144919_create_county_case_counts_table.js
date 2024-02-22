"use strict";

exports.up = (knex) =>
  knex.schema.hasTable("county_case_counts").then((exists) => {
    if (!exists) {
      return knex.schema.createTable("county_case_counts", function (table) {
        table.string("id", 255).notNullable().unique();
        table.dateTime("created_at");
        table.dateTime("updated_at");
        table.string("county", 1000);
        table.string("state", 1000);
        table.string("state_ab", 1000);
        table.text("incidences");
        // table.index(
        //   ["created_at", "county", "state_ab"],
        //   "idx_created_at_county_state_ab",
        //   {
        //     indexType: "BTREE",
        //   }
        // );
      });
    }
  });

exports.down = (knex) => knex.schema.dropTable("county_case_counts");
