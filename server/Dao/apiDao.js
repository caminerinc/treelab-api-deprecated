const DaoBase = require('fishbone_c').DaoBase;
const Sequelize = require('sequelize');
const mongoose = require('mongoose');
const config = require('../Util/config');

class apiDao extends DaoBase {

  constructor(db) {
    super(db);
  }
}
module.exports = apiDao;