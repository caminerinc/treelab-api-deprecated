const { createUid } = require('../util/helper');

const { PREFIX_TYPE } = require('../constants/app');

module.exports = (sequelize, DataTypes) => {
  const typeOptions = sequelize.define(
    'typeOptions',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      numberTypeId: DataTypes.INTEGER.UNSIGNED,
    },
    {},
  );
  typeOptions.associate = function(models) {
    typeOptions.belongsTo(models.numberTypes, {
      foreignKey: 'numberTypeId',
      as: 'numberType',
    });
  };
  return typeOptions;
};
