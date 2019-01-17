module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('records', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING,
        },
        tableId: {
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
      })
      .then(() => {
        return queryInterface.addConstraint('records', ['tableId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'tables',
            field: 'id',
          },
          onDelete: 'cascade',
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('records');
  },
};
