const dbConfig = require('./db-config.json');

module.exports = {
  port: 9000,
  postgres: dbConfig,
  middleware: ['errHandle'],
};
