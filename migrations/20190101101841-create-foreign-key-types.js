'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('foreignKeyTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      relationship: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      foreignTableId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      symmetricFieldId: {
        type: Sequelize.STRING,
      },
      fieldId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('foreignKeyTypes');
  },
};
