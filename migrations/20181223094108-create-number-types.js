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
        allowNull: false,
        type: Sequelize.STRING,
      },
      precision: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      negative: {
        allowNull: false,
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
