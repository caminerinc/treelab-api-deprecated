module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('fieldValues', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        recordId: {
          allowNull: false,
          type: Sequelize.STRING(18),
        },
        fieldId: {
          allowNull: false,
          type: Sequelize.STRING(18),
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
      })
      .then(() => {
        return queryInterface.addConstraint(
          'fieldValues',
          ['recordId', 'fieldId'],
          {
            type: 'unique',
          },
        );
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('fieldValues');
  },
};
