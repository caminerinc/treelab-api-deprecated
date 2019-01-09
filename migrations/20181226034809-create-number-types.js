module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('numberTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      format: {
        type: Sequelize.STRING,
      },
      precision: {
        type: Sequelize.INTEGER,
      },
      negative: {
        type: Sequelize.BOOLEAN,
      },
      fieldId: {
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
    return queryInterface.dropTable('numberTypes');
  },
};
