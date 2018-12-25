'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('typeOptions', [], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('typeOptions', null, {});
  },
};
