module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('positions', {
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('positions');
  },
};
