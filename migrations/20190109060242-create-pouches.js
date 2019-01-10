module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('pouches', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      moduleId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      baseId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      triggerTableId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      triggerFieldId: {
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
    return queryInterface.dropTable('pouches');
  },
};
