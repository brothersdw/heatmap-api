// const nconf = require('./config/nconf')

module.exports = {
  client: "mysql",
  connection: {
    host: "mysql",
    user: "<user>",
    password: "<password>",
    database: "<database>",
    port: "3306",
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
