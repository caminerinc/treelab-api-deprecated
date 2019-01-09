module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('multipleAttachmentValues', {
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
      })
      .then(() => {
        return queryInterface.addConstraint(
          'multipleAttachmentValues',
          ['fieldValueId'],
          {
            type: 'FOREIGN KEY',
            references: {
              table: 'fieldValues',
              field: 'id',
            },
            onDelete: 'cascade',
          },
        );
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('multipleAttachmentValues');
  },
};
