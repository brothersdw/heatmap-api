"use strict";

const knexConfigs = require("../knexfile");
const Bookshelf = require("bookshelf");
const Knex = require("knex");
const bookshelfUuid = require("bookshelf-uuid");
const bookshelfUpsert = require("bookshelf-upsert");
const jsonColumns = require("bookshelf-json-columns");

const knex = Knex(knexConfigs);
const bookshelf = Bookshelf(knex);

bookshelf.plugin(bookshelfUuid);
bookshelf.plugin(bookshelfUpsert);
bookshelf.plugin(jsonColumns);

module.exports = bookshelf;
