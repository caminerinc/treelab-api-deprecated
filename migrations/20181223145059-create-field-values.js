module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fieldValues', {
      recordId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      fieldId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      textValue: {
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
    return queryInterface.dropTable('fieldValues');
  },
};
