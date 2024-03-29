const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const minimist = require('minimist');
const createNamespace = require('cls-hooked').createNamespace;

const basename = path.basename(__filename);
const args = minimist(process.argv.slice(2));
const envConfig = require(__dirname + `/../../config/config.js`);
const env = args.env || envConfig.nodeEnv;
const config = require(__dirname + `/../../config/db-config.json`)[env];
const namespace = createNamespace('treelab-api');

Sequelize.useCLS(namespace);

const db = {};

let sequelize;

sequelize = new Sequelize(
  config.database,
  config.username,
  process.env.AWS_DB_PASSWORD || config.password,
  config,
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
