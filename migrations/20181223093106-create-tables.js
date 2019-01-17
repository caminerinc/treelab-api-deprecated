module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('tables', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING(18),
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        baseId: {
          allowNull: false,
          type: Sequelize.STRING(18),
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
        return queryInterface.addConstraint('tables', ['baseId'], {
          type: 'FOREIGN KEY',
          references: {
            table: 'bases',
            field: 'id',
          },
          onDelete: 'cascade',
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tables');
  },
};
