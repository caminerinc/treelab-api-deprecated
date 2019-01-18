module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('formulaTypes', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        formulaText: {
          type: Sequelize.STRING,
        },
        format: {
          type: Sequelize.STRING,
        },
        precision: {
          type: Sequelize.INTEGER,
        },
        symbol: {
          type: Sequelize.STRING,
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
      })
      .then(() => {
        return queryInterface.addIndex('formulaTypes', ['fieldId']);
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('formulaTypes');
  },
};
