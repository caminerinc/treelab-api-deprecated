'use strict';
module.exports = (sequelize, DataTypes) => {
  const numberValues = sequelize.define(
    'numberValues',
    {
      value: DataTypes.INTEGER,
    },
    {},
  );
  return numberValues;
};
