module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('fields', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING,
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        tableId: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        fieldTypeId: {
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
        return queryInterface.addConstraint('fields', ['tableId'], {
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
    return queryInterface.dropTable('fields');
  },
};
