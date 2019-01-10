const { createUid } = require('../util/helper');
const { PREFIX_TYPE } = require('../constants/app');

module.exports = (sequelize, DataTypes) => {
  const pouches = sequelize.define(
    'pouches',
    {
      id: {
        allowNull: false,
        defaultValue: () => createUid(PREFIX_TYPE.POUCH),
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      moduleId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      baseId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      triggerTableId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      triggerFieldId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );

  pouches.associate = function(models) {
    pouches.belongsTo(models.modules, {
      foreignKey: 'moduleId',
      as: 'module',
    });
  };

  return pouches;
};
