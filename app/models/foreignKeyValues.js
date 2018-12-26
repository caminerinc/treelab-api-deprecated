'use strict';
module.exports = (sequelize, DataTypes) => {
  const foreignKeyValues = sequelize.define(
    'foreignKeyValues',
    {
      fieldValueId: DataTypes.INTEGER,
      name: DataTypes.STRING,
    },
    {},
  );
  return foreignKeyValues;
};
