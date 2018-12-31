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
