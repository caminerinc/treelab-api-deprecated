const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'develop';
const app = require('../../lib/core/app');
// const config = require(__dirname + '/../../config/config.json');
console.log('WHAT IS THE CONFIG IN APP', app);
const db = {};

let sequelize;

sequelize = new Sequelize(
  config.postgres.database,
  config.postgres.username,
  config.postgres.password,
  config.postgres,
);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
