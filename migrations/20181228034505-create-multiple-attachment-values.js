module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('multipleAttachmentValues', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      fieldValueId: {
        type: Sequelize.INTEGER,
      },
      url: {
        type: Sequelize.STRING,
      },
      fileName: {
        type: Sequelize.STRING,
      },
      fileType: {
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
    return queryInterface.dropTable('multipleAttachmentValues');
  },
};
