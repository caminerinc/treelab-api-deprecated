const { createUid } = require('../util/helper');

const { PREFIX_TYPE } = require('../constants/app');

module.exports = (sequelize, DataTypes) => {
  const numberTypes = sequelize.define(
    'numberTypes',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
      },
      format: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      precision: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      negative: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
    },
    {},
  );
  numberTypes.associate = function(models) {};
  return numberTypes;
};
