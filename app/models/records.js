const { createUid } = require('../util/helper');

const { PREFIX_TYPE } = require('../constants/app');

module.exports = (sequelize, DataTypes) => {
  const records = sequelize.define(
    'records',
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
  records.associate = function(models) {
    records.hasMany(models.fieldValues, {
      foreignKey: 'recordId',
      as: 'fieldValues',
    });
  };
  return records;
};
