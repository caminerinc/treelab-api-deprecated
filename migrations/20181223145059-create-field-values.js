module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('fieldValues', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
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
      numberValue: {
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fieldValues');
  },
};
