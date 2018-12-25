'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('numberTypes', [], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('numberTypes', null, {});
  },
};
