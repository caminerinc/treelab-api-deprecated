module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('positions', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING,
        },
        parentId: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        position: {
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
        return queryInterface.addIndex('positions', ['parentId']);
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('positions');
  },
};
