'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Bases', 'icon', Sequelize.STRING);
    return queryInterface.addColumn('Bases', 'color', Sequelize.STRING);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.remove('Bases', 'icon', Sequelize.STRING);
    return queryInterface.remove('Bases', 'color', Sequelize.STRING);
  },
};
