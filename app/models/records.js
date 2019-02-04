const { createUid } = require('../util/helper');

const { PREFIX_TYPE } = require('../constants/app');

module.exports = (sequelize, DataTypes) => {
  const Records = sequelize.define(
    'Records',
    {
      id: {
        allowNull: false,
        defaultValue: () => createUid(PREFIX_TYPE.RECORD),
        primaryKey: true,
        type: DataTypes.STRING,
      },
      tableId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );
  // Records.associate = function(models) {};
  return Records;
};
