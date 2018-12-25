module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('typeOptions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      numberTypeId: Sequelize.INTEGER.UNSIGNED,
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
    return queryInterface.dropTable('typeOptions');
  },
};
