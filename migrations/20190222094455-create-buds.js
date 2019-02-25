module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Bases', 'budId', { type: Sequelize.UUID });
    return await queryInterface.createTable('Buds', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      actionId: {
        type: Sequelize.INTEGER,
      },
      appId: {
        type: Sequelize.INTEGER,
      },
      properties: {
        type: Sequelize.JSONB,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Bases', ['budId']);
    return await queryInterface.dropTable('Buds');
  },
};
