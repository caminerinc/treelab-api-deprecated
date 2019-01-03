'use strict';
module.exports = (sequelize, DataTypes) => {
  const foreignKeyValues = sequelize.define(
    'foreignKeyValues',
    {
      fieldValueId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      symmetricFieldValueId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      name: DataTypes.STRING,
    },
    {},
  );
  foreignKeyValues.associate = function(models) {
    // associations can be defined here
  };
  return foreignKeyValues;
};
