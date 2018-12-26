'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('typeOptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      numberTypeId: {
        type: Sequelize.INTEGER
      },
      foreignKeyTypeId: {
        type: Sequelize.INTEGER
      },
      multiSelectTypeId: {
        type: Sequelize.INTEGER
      },
      rollupTypeId: {
        type: Sequelize.INTEGER
      },
      formulaTypeId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('typeOptions');
  }
};