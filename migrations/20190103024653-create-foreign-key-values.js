'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('foreignKeyValues', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        fieldValueId: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        symmetricFieldValueId: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() => {
        queryInterface.addConstraint('foreignKeyValues', ['fieldValueId'], {
          type: 'foreign key',
          references: {
            table: 'fieldValues',
            field: 'id',
          },
          onDelete: 'cascade',
        });
        return queryInterface.addConstraint(
          'foreignKeyValues',
          ['fieldValueId', 'symmetricFieldValueId'],
          {
            type: 'unique',
          },
        );
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('foreignKeyValues');
  },
};
